"use strict";
var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var uuidV1 = require('uuid/v1');
var CRC32 = require('crc-32');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cookieParser());
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var users = {};
var tokens = {};
app.use(function (req, res, next) {
    if (req.cookies['token'] !== undefined) {
        var token = req.cookies['token'];
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
app.get('/', function (req, res) {
    if (!req['user']) {
        res.location('/login');
        return res.sendStatus(302);
    }
    return res.render('index', { user: req['user'] });
});
app.get('/register', function (req, res) {
    res.render('register');
});
app.post('/register', urlencodedParser, function (req, res) {
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
app.get('/flag', function (req, res) {
    if (!req['user'] || (req['user'].role !== 'Admin')) {
        return res.sendStatus(403);
    }
    return res.render('flag', { user: req['user'] });
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.post('/login', urlencodedParser, function (req, res) {
    if (!req.body || !req.body.username || !req.body.password) {
        res.location('/');
        return res.sendStatus(400);
    }
    if (!users[req.body.username]) {
        return res.render('login', { error: "Not registered username" });
    }
    if (users[req.body.username] !== req.body.password) {
        return res.render('login', { error: "No valid password" });
    }
    var uuid = uuidV1();
    res.cookie("token", uuid);
    tokens[uuid] = { name: req.body.username, password: req.body.password };
    res.location('/');
    return res.sendStatus(302);
});
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
//# sourceMappingURL=app.js.map