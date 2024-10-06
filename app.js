const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const apiRouter = require('./routes/routes'); 
const auth = require('./routes/auth')// Nếu bạn có router riêng cho API

const app = express();

// Cấu hình view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Định nghĩa route

app.use('/', apiRouter); // Chuyển hướng đến router API
app.use('/autj/', auth);

// Xử lý lỗi 404
app.use((req, res, next) => {
  res.status(404).send('404: Not Found'); // Hoặc bạn có thể render một trang lỗi tùy chỉnh
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
