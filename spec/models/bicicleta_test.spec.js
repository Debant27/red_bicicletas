var Bicicleta = require('../../models/bicicleta');

beforeEach(() => { Bicicleta.allBicis = []; });

describe('Bicicleta.allBicis', () => {
    it('comienza vacia', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe('Bicicleta.add', () => {
    it('agrega una bicicleta',() => {
        expect(Bicicleta.allBicis.length).toBe(0);

        var a = new Bicicleta(1, 'rojo', 'urbana', [9.9365915,-84.1080593]);
        Bicicleta.add(a);

        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe('Bicicleta.findByID', () => {
    it('devolver la bici con el ID 1',() => {
        expect(Bicicleta.allBicis.length).toBe(0);
        var a = new Bicicleta(1, 'rojo', 'urbana', [9.9365915,-84.1080593]);
        var b = new Bicicleta(2, 'negra', 'ruta', [9.9346707,-84.1076373]);
        Bicicleta.add(a);
        Bicicleta.add(b);

        var targetBici = Bicicleta.findByID(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(a.color);
        expect(targetBici.modelo).toBe(a.modelo);
    });
});

describe('Bicicleta.removeByID', () => {
    it('remueve la bicicleta con el ID 1', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
        var a = new Bicicleta(1, 'rojo', 'urbana', [9.9365915,-84.1080593]);
        Bicicleta.add(a);
        
        Bicicleta.removeByID(1);
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});