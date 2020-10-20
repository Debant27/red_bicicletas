var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');

describe('Testing Usuarios', function(){
    beforeAll(function(done) {
        mongoose.connection.close().then(() => {        
            var mongoDB = 'mongodb://localhost/testdb';        
            mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });        
            mongoose.set('useCreateIndex', true);        

            var db = mongoose.connection;        
            db.on('error', console.error.bind(console, 'MongoDB connection error: '));        
            db.once('open', function () {        
                console.log('We are connected to test database!');
                done();        
            });        
        });        
    });

    afterEach(function(done){
        Reserva.deleteMany({}, function(err, sucess){
            if (err) console.log(err);
            Usuario.deleteMany({}, function(err, sucess){
                if (err) console.log(err);
                Bicicleta.deleteMany({}, function(err, sucess){
                    if (err) console.log(err);
                    done();
                });
            });
        });
    });

    describe('Cuando un usuario reserva una bici', () => {
        it('debe existir la reserva', (done) =>{
            const usuario = new Usuario({nombre: 'Anthony'});
            usuario.save();
            const bicicleta = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            bicicleta.save();

            var hoy = new Date();
            var mañana = new Date();
            mañana.setDate(hoy.getDate()+1);
            usuario.reservar(bicicleta.id, hoy, mañana, function(err, reserva){
                //Aca usamos promises, con el populate hacemos referencia a los schemas de usuario y bicicleta y mediante esto podemos jalar los objetos con todas sus propiedades
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas){
                    console.log(reservas[0]);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();
                });                    
            });
        });
    });
});