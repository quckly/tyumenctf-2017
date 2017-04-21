var express = require('express')
    , path = require('path')
    , https = require('https')
    , fs = require('fs');

var app = express();

var options = {
    dotfiles: 'ignore',
    etag: false,
    index: false,
    maxAge: '1d',
    redirect: false
}

app.set('port', process.env.PORT || 10443);
app.use(express.static(path.join(__dirname, 'public'), options));

app.get('/', function (req, res) {
    if (!req.client.authorized) {
        return res.status(401).sendFile(path.join(__dirname, 'public', 'index.html'));
    }

    res.status(200);
    if (req.socket.getPeerCertificate().subject.CN === "Admin") {
        res.end("Flag is NoirCTF{cl13n7_c3rtzz_s0O_c00l}");
    } else {
        res.end("Hello, " + req.socket.getPeerCertificate().subject.CN + ". Only Admin can view private data. Go away!\n");
    }
});

var options = {
    key: fs.readFileSync('public/server.key'),
    cert: fs.readFileSync('public/server.crt'),
    ca: [fs.readFileSync('public/ca.crt')],
    requestCert: true,
    rejectUnauthorized: false
};

https.createServer(options, app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
