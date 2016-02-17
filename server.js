var path = require('path');
var express = require('express');
var session = require('express-session');
var api = require('./routes/api.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser('placeholder_secret'));
app.use(session({secret: 'placeholder_secret', cookie: {domain: 'localhost', path: '/', httpOnly: true, secure: false, maxAge: null }}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'client')));
app.use('/api', api);

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    console.log('Server listening on port ' + server.address().port);
});
