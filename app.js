var express     = require('express');
var http        = require('http');
var path        = require('path');
var favicon     = require('static-favicon');
var logger      = require('morgan');
var cookieParser= require('cookie-parser');
var bodyParser  = require('body-parser');
var session     = require('express-session');
var mongodb     = require('mongodb');
var mongoose    = require('mongoose');
var upload      = require('jquery-file-upload-middleware');
//var passport    = require('passport');
//var LocalStrategy= require('passport-local').Strategy;
//var flash       = require('connect-flash');

upload.configure({
    uploadDir: __dirname+'/public/uploads',
});
// database setup

mongoose.connect('localhost','Doug');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
    console.log('Connected to DB');
});



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('photos', __dirname + '/public/photos');

app.use(favicon());
app.use(logger('dev'));
app.use('/photo_upload', upload.fileHandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//app.use(session({secret: 'test'}));
//app.use(flash());
//app.use(passport.initialize());
//app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


// routes setup
var routes  = require('./routes');
//var users   = require('./routes/user');

var fs = require('fs');
app.get('/', function(req, res){
    var readable = fs.createReadStream('./main.html');
    readable.pipe(res);
});
//app.get('/', routes.index);
//app.post('/photo_upload', routes.photo);
app.post('/post', routes.post);
app.get('/post', routes.post);
app.delete('/post/:id(*)', routes.post);   


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
