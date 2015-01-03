var path = require('path');

var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
//use flash
var flash = require('connect-flash');
//use session
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'html');
app.engine('html', require('ejs').__express);


// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(session);
app.use(session({
  secret: config.cookieSecret,
  key: config.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    db: config.db,
    host: config.host,
    port: config.port
  }),
    resave: true,
    saveUninitialized: true,
}));

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// set static,
app.locals.config = config;

routes(app);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
