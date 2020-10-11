var Bicicleta = function (id, color, modelo, ubicacion) {
    this.id = id;
    this.color = color;
    this .modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.prototype.toString = function () {
    return 'id: ' + this.id + " | color: " + this.color;
}

//Agregamos a Bicicleta una propiedad allBicis
Bicicleta.allBicis = [];

//Propiedad de agregado mediante una funcion de pushea en el array allBicis
Bicicleta.add = function(aBici){
    Bicicleta.allBicis.push(aBici);
}

Bicicleta.findByID = function(aBiciID){
    //find(x => x.if == aBici) Esta funcion busca en nuestro array si lo encuentra == lo asigna a aBici
    var aBici = Bicicleta.allBicis.find(x => x.id == aBiciID);
    if (aBici)
        return aBici;
    else
        throw new Error(`No existe una bicicleta con el id ${aBiciID}`);
}

Bicicleta.removeByID = function(aBiciID){
    for (var i = 0; i < Bicicleta.allBicis.length; i++) {
        if (Bicicleta.allBicis[i].id == aBiciID){
            //splice elimina un elemento del array
            Bicicleta.allBicis.splice(i,1);
            break;
        }
    }
}

//Instanciamos a bicicleta
var a = new Bicicleta(1, 'rojo', 'urbana', [9.9365915,-84.1080593]);
var b = new Bicicleta(2, 'negra', 'ruta', [9.9346707,-84.1076373]);

//Agregamos las bicis al array
Bicicleta.add(a);
Bicicleta.add(b);


module.exports = Bicicleta;