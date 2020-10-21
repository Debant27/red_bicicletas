var mongoose = require('mongoose');
var Reserva = require('./reserva');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const saltRounds = 10;
var crypto = require('crypto');

const Token = require('./token');
const mailer = require('../mailer/mailer') ;

const validateEmail = function(email){
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Por favor ingrese un email valido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

//No son parte de mongoose hay que agregarlos mediante la palabra plugin.
usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe con otro usuario'});

//Esta funcion se ejecuta antes del save
usuarioSchema.pre('save', function(next){
    if (this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.methods.reservar = function(BiciID, desde, hasta, cb){
    var reseva = new Reserva({usuario: this._id, bicicleta: BiciID, desde: desde, hasta: hasta});
    console.log(reseva);
    reseva.save(cb);
};

usuarioSchema.methods.enviar_email_bienvenida = function(cb){
    const token = new Token({_userID: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err){
        if (err) {return console.log(err.message);}

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Verificación de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para verificar su cuenta haga click en este link: \n' + 'http://localhost:5000' + '\/token/confirmation\/' + token.token + '.\n'
        };

        mailer.sendMail(mailOptions, function(err){
            if (err) {return console.log(err.message);}
            console.log(`A verification email has been send to ${email_destination}`);
        });
    });
}

module.exports = mongoose.model('Usuario', usuarioSchema);