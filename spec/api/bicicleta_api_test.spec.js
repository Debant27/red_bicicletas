var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');

beforeEach(() => { Bicicleta.allBicis = []; });

describe('Bicicleta API', () => {
    describe('GET Bicicletas /', () => {
        it('Status 200', () => {
            expect(Bicicleta.allBicis.length).toBe(0);

            var a = new Bicicleta(1, 'rojo', 'urbana', [9.9365915,-84.1080593]);
            Bicicleta.add(a);
            
            request.get('http://localhost:5000/api/bicicletas', function(error, response, body){
                expect(response.statusCode).toBe(200);
            });
        });
    });

    describe('POST Bicicletas /create', () => {
        it('Status 200', (done) => {
            var headers = {'content-type' : 'application/json'};
            var a = '{ "id": 1 , "color": "rojo" , "modelo": "urbana" , "lat": 9.9365915 , "lng": -84.1080593}';
            request.post({
                headers: headers,
                url: 'http://localhost:5000/api/bicicletas/create',
                body: a
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.allBicis.length).toBe(1);
                expect(Bicicleta.findByID(1).color).toBe("rojo");
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