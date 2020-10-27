var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('./config/passport');
var jwt = require('jsonwebtoken');
const session = require('express-session');
const store = new session.MemoryStore;
var indexRouter = require('./routes/index');
var usuariosRouter = require('./routes/usuarios');
var tokenRouter = require('./routes/token');
var bicicletaRouter = require('./routes/bicicletas');
var bicicletaAPIRouter = require('./routes/api/bicicletas');
var usuariosAPIRouter = require('./routes/api/usuarios');
var authAPIRouter = require('./routes/api/auth');


const Usuario = require('./models/usuario');
const Token = require('./models/token');

var app = express();

//esto lo usamos para cifrar los token de json
app.set('secretkey', 'jwt_pwd_!!223344');

app.use(session({
  cookie: { maxAge: 240 * 60 * 60 * 1000},
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'red_bicis_!!!!****.*.-*/1231313'
}));

var mongoose = require('mongoose');

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
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', function(req, res){
  res.render('session/login');
});

app.post('/login', function(req, res, next){
  passport.authenticate('local', function(err, usuario, info){
    if (err) return next(err);
    if (!usuario) return res.render('session/login', {info});
    req.logIn(usuario, function(err){
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

app.get('/forgotPassword', function(req,res){
  res.render('session/forgotPassword');
});

app.post('/forgotPassword', function(req, res){
  Usuario.findOne({ email: req.body.email }, function(err, usuario){
      if (!usuario) return res.render('session/forgotPassword', {info: {message: 'No existe el email para un usuario existente'}});
      usuario.resetPassword(function(err){
          if (err) return next(err);
          console.log('session/forgotPasswordMessage');
      });
      res.render('session/forgotPasswordMessage');
  });
});

app.get('/resetPassword/:token', function(req, res, next){
  Token.findOne({ token: req.params.token }, function(err, token){
      if (!token) return res.status(400).send({type: 'not-verified', msg: 'No existe un usuario asociado al token. Verifique que su token no haya expirado.'});

      Usuario.findById(token._userID, function(err, usuario){
          if (!usuario) return res.status(400).send({msg: 'No existe un usuario asociado al token.'});
          res.render('session/resetPassword', {errors: {}, usuario: usuario});
      });
  });
});

app.post('/resetPassword', function(req, res){
  if(req.body.password != req.body.confirm_password){
      res.render('session/resetPassword', {errors: {confirm_password: {message: 'No coincide con el password ingresado'}}, usuario: new Usuario({email: req.body.email})});
      return;
  }
  Usuario.findOne({email: req.body.email}, function(err, usuario){
      usuario.password = req.body.password;
      usuario.save(function(err){
          if(err){
              res.render('session/resetPassword', {errors: err.errors, usuario: new Usuario({email: req.body.email})});
          }
          else{
              res.redirect('/login');
          }
      });
  });
});

//Definir el uso del modulo
app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);
app.use('/bicicletas', loggedIn, bicicletaRouter); //loggedIn es el middleware que valida si el user esta logueado
app.use('/api/auth', authAPIRouter);
app.use('/api/bicicletas', validarUsuario, bicicletaAPIRouter);
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

function loggedIn(req, res, next){
  if (req.user){
    next(); //el next hace que pase a la siguiente funcion
  }
  else {
    console.log('user sin loguearse');
    res.redirect('/login');
  }
};

function validarUsuario(req, res, next){
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded){
    if (err) {
      res.json({status:"error", message: err.message, data:null});
    }
    else {
      req.body.userId = decoded.id;
      console.log('jwt verify ' + decoded);
      next();
    }   
  });
}

//Exportamos la app
module.exports = app;