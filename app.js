const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
require('./src/helper/connections_mongdb');

const app = express();

// Set up the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json()); // Phân tích dữ liệu JSON
app.use(express.urlencoded({ extended: true })); // Phân tích dữ liệu URL-encoded
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Define routes
app.use('/', indexRouter);
// Handle 404 errors
app.use((req, res, next) => {
  next(createError(404));
});

// General error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
