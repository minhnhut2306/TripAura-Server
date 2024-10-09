const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
require('./src/helper/connections_mongdb');
const cors = require('cors');
const swaggerSetup = require('./routes/swagger');
const swaggerUi = require('swagger-ui-express');
const router = require('./routes/routes');

const app = express();

// Thiết lập Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup));

// Cấu hình view engine và các middleware khác
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/', router);

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
