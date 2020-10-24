var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
// const apiRouter = require("./routes/api");
// const apiRouter2 = require("./routes/apiimdb");
// const apiRouter3 = require("./routes/apinetflix");
// const apiRouter4 = require("./routes/apitwitter");

/* Route Handling */
const sentimentServer = require('./routes/sentimentServer');



var app = express();
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const flash = require('express-flash');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const request = require("request");
const ObjectsToCsv = require('objects-to-csv')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Beginning app routes.
 */
app.get('/', (req, res) => {
    return res.render('opening', { title: "Welcome" });
});



app.get('/homepage', (req, res) => {
    res.render('homepage', {title: 'Homepage'});
});

app.get('/result', sentimentServer.result);
app.get('/intervalData', sentimentServer.intervalData);



// app.use("/api", apiRouter);
// app.use("/apiimdb", apiRouter2);
// app.use("/apinetflix", apiRouter3);
// app.use("/apitwitter", apiRouter4);



// catch 404 and forward to error handler

// error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s App is running at port %d', chalk.blue('✓'), app.get('port'));
    console.log('  Press CTRL-C to stop\n');
  });
  


module.exports = app;
