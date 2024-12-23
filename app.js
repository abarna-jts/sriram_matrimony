const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const bodyParser = require('body-parser');
const multer = require('multer');

const indexRouter = require('./routes/admin');
const usersRouter = require('./routes/users');

const app = express();

// Set views and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use("/uploads", express.static("uploads"));

app.use(session({
  secret: 'your-secret-key', // Replace with a real secret key
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Use `true` if you're using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
  }
}));

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure file upload
// const upload = multer({ dest: 'uploads/' });

// Set up the routes
app.use('/admin', indexRouter);  // Admin page route
app.use('/', usersRouter);  // User page route

// Handle 404 errors
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
