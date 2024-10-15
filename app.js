const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
require("./src/helper/connections_mongdb");
const cors = require("cors");
const swaggerSetup = require("./routes/swagger");

const router = require("./routes/routes");

const app = express();

// Thiết lập Swagger
swaggerSetup(app);

// Cấu hình view engine và các middleware khác
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const createError = require("http-errors");

// Define routes
app.use("/", router);

// Handle 404 errors
app.use((req, res, next) => {
  next(createError(404));
});

// app.listen( () => {
//   console.log(`Server is running on http://localhost:3000`);
// });

// General error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
