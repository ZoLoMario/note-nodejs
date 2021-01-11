const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const morgan = require("morgan");
const connectMongo = require("connect-mongo");
const mongoose = require("mongoose");
const multer = require("multer");

const { createAdminUser } = require("./libs/createUser");

// Initializations
const app = express();
require("./config/passport");
createAdminUser();

// thêm thư viện phân tích body dạng json
const bodyParse = require('body-parser');
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }))

// settings
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);

exphbs.create({
  helpers: {
        equals: function(string1 ,string2 ,string3 , options) {
              if (string1 === string2 || string1 === string3 ) {
                  return options.fn(this);
              } else {
                  return options.inverse(this);
              }
          }
}});

app.set("view engine", ".hbs");

// middlewares
app.use(morgan("dev"));
app.use(methodOverride("_method"));
const MongoStore = connectMongo(session);
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// routes
app.use(require("./routes/index.routes"));
app.use(require("./routes/users.routes"));
app.use(require("./routes/notes.routes"));
app.use(require("./routes/tags.routes"));
app.use(require("./routes/calendar.routes"));
app.use(require("./routes/fileupload.routes"));
// static files
app.use(express.static(path.join(__dirname, "public")));
app.use('/public/up', express.static(path.join(__dirname,'..','uploads')));
app.use((req, res) => {
  res.render("404");
});

module.exports = app;
