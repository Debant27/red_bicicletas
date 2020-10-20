var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: { type: '2dsphere', sparse: true} //2dsphere: indice de tipo geografico
    }
});

//Este createInstance nos sirve para agregar nuevas bicicletas esto porque trabajos con el Schema
bicicletaSchema.statics.createInstance = function(code, color, modelo, ubicacion){
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
};

bicicletaSchema.methods.toString = function () {
    return 'code: ' + this.code + " | color: " + this.color;
};

//statics es para agregarlo directamente al modelo
bicicletaSchema.statics.allBicis = function (cb) {
    return this.find({}, cb);   
};

bicicletaSchema.statics.add = function(aBici, cb){
    this.create(aBici, cb);
};

bicicletaSchema.statics.findByCode = function(aCode, cb) {
    return this.findOne({code: aCode}, cb);
}

bicicletaSchema.statics.removeByCode = function(aCode, cb) {
    return this.deleteOne({code: aCode}, cb);
}

module.exports = mongoose.model('Bicicleta', bicicletaSchema);