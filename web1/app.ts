import express = require('express');
import path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const uuidV1 = require('uuid/v1');
var CRC32 = require('crc-32');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cookieParser());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var users = {};
var tokens = {};

app.use((req, res, next) => {
    if (req.cookies['token'] !== undefined) {
        let token: string = req.cookies['token'];
        if (tokens[token] !== undefined) {
            req['user'] = tokens[token];

            if (CRC32.str(req['user'].name + req['user'].password) === 0x3CC34518) {
                req['user'].role = "Admin";
            }
        }
    }

    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req: express.Request, res: express.Response) => {
    if (!req['user']) {
        res.location('/login');
        return res.sendStatus(302);
    }

    return res.render('index', { user: req['user'] });
});

app.get('/register', (req: express.Request, res: express.Response) => {
    res.render('register');
});

app.post('/register', urlencodedParser, (req: express.Request, res: express.Response) => {
    if (!req.body || !req.body.username || !req.body.password) {
        res.location('/');
        return res.sendStatus(400);
    }

    if (users[req.body.username] !== undefined) {
        return res.render('register', { error: "That username already registered" });
    }

    users[req.body.username] = req.body.password;
    
    res.location('/login');
    return res.sendStatus(302);
});

app.get('/flag', (req: express.Request, res: express.Response) => {
    if (!req['user'] || (req['user'].role !== 'Admin')) {
        return res.sendStatus(403);
    }

    return res.render('flag', { user: req['user'] });
});

app.get('/login', (req: express.Request, res: express.Response) => {
    res.render('login');
});

app.post('/login', urlencodedParser, (req: express.Request, res: express.Response) => {
    if (!req.body || !req.body.username || !req.body.password) {
        res.location('/');
        return res.sendStatus(400);
    }

    if (!users[req.body.username]) {
        return res.render('login', {error: "Not registered username"});
    }

    if (users[req.body.username] !== req.body.password) {
        return res.render('login', { error: "No valid password" });
    }

    let uuid = uuidV1();
    res.cookie("token", uuid);
    tokens[uuid] = { name: req.body.username, password: req.body.password };
    res.location('/');
    return res.sendStatus(302);
});

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

app.use((err: any, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
