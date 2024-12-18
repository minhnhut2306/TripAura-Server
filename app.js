const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const createError = require("http-errors");
require("./src/helper/connections_mongdb");
const cors = require("cors"); // Giữ lại khai báo này
const swaggerSetup = require("./routes/swagger");

const router = require("./routes/routes");

const app = express();
swaggerSetup(app);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const allowCrossDomain = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
};
app.use(allowCrossDomain);  // Cho phép tất cả các origin
app.use(express.json());
app.use("/", router);

// app.get('/success', (req, res) => {
//   console.log("Đã gọi route /success"); 
//   res.render('success');
// });

// app.get('/cancel', (req, res) => {
//   res.render('cancel'); 
// });

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
