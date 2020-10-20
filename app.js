var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bicicletaRouter = require('./routes/bicicletas');
var bicicletaAPIRouter = require('./routes/api/bicicletas');
var usuariosAPIRouter = require('./routes/api/usuarios');

var app = express();

var mongoDB = 'mongodb://localhost/red_bicicletas';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;    
var db = mongoose.connection; 
db.on('error', console.log.bind(console, 'MongoDB connection error: '));
db.once('open', function () {        
  console.log('We are connected to test database!');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//carpeta de contenido estatico
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Definir el uso del modulo
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bicicletas', bicicletaRouter);
app.use('/api/bicicletas', bicicletaAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Exportamos la app
module.exports = app;