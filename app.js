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

app.use(cors()); // Sử dụng cors ở đây
app.use("/", router);

app.get('/success', (req, res) => {
  console.log("Đã gọi route /success"); // Log để kiểm tra
  res.render('success');
});

app.get('/cancel', (req, res) => {
  res.render('cancel'); // Tương tự với cancel.hbs
});

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
