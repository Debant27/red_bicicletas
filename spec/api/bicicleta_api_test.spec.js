var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');
var mongoose = require('mongoose');
var base_url = 'http://localhost:5000/api/bicicletas';

describe('Bicicleta API', () => {
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
        Bicicleta.deleteMany({}, function(err, sucess){
            if (err) console.log(err);
            done();
        });
    });

    describe('GET Bicicletas /', () => {
        it('Status 200', (done) => {            
            request.get(base_url, function(error, response, body){
                var result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.bicicletas.length).toBe(0);
                done();
            });
        });
    });

    describe('POST Bicicletas /create', () => {
        it('Status 200', (done) => {
            var headers = {'content-type' : 'application/json'};
            var aBici = '{ "id": 1 , "color": "rojo" , "modelo": "urbana" , "lat": 9.9365915 , "lng": -84.1080593}';
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: aBici
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body).bicicleta
                console.log(bici);
                expect(bici.color).toBe("rojo");
                expect(bici.ubicacion[0]).toBe("9.9365915");
                expect(bici.ubicacion[1]).toBe("-84.1080593");
                done(); //es lo que espera jasmine para finalizar el  test
            });
        });
    });

    //Test de eliminación
    describe('POST Bicicletas /create', () => {
        //primero la agregamos con el ID=1
        var headers = {'content-type' : 'application/json'};
        var a = '{ "id": 1 , "color": "rojo" , "modelo": "urbana" , "lat": 9.9365915 , "lng": -84.1080593}';
        it('Status 200', () => {
            request.post({
                headers: headers,
                url: 'http://localhost:5000/api/bicicletas/create',
                body: a
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
            });
        });
        //Aqui hacemos la eliminacion
        describe('DELETE Bicicletas /delete', () => {
            var ID = '{ "id": 1}';
            it('Status 204', (done) => {
                request.delete({
                    headers: headers,
                    url: `http://localhost:5000/api/bicicletas/delete`,
                    body: ID
                }, function(error, response, body){
                    expect(response.statusCode).toBe(204);
                    done();
                });
            });
        });
    });

    //Prueba de edición
    describe('POST Bicicletas /create', () => {
        //primero la agregamos con el ID=1
        var headers = {'content-type' : 'application/json'};
        var a = '{ "id": 1 , "color": "rojo" , "modelo": "urbana" , "lat": 9.9365915 , "lng": -84.1080593}';
        it('Status 200', () => {
            request.post({
                headers: headers,
                url: 'http://localhost:5000/api/bicicletas/create',
                body: a
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
            });
        });
        //Aqui realizamos la modificación
        describe('POST Bicicletas /update', () => {
            it('Status 200', () => {
                var b = '{"color": "azul" , "modelo": "ruta" , "lat": 9.9365915 , "lng": -84.1080593}';
                request.post({
                    headers: headers,
                    url: `http://localhost:5000/api/bicicletas/1/update`,
                    body: b
                }, function(error, response, body){
                    expect(response.statusCode).toBe(200);
                    console.log(body);
                });
            });
        });
    });
});