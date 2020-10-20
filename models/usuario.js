var mongoose = require('mongoose');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre: String,
});

usuarioSchema.methods.reservar = function(BiciID, desde, hasta, cb){
    var reseva = new Reserva({usuario: this._id, bicicleta: BiciID, desde: desde, hasta: hasta});
    console.log(reseva);
    reseva.save(cb);
};

module.exports = mongoose.model('Usuario', usuarioSchema);