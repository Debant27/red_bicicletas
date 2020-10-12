var map = L.map('main_map').setView([9.9359045,-84.1033914], 17);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/*var ubicacion1 = L.marker([9.9365915,-84.1080593]).addTo(mymap);
ubicacion1.bindPopup("<b>Bicicletas urbanas</b><br>Muy comodas para andar en el parque").openPopup();
var ubicacion2 = L.marker([9.9346707,-84.1076373]).addTo(mymap);
ubicacion2.bindPopup("<b>Bicicletas de Ruta</b><br>Se pueden usar en la pista").openPopup();
var ubicacion3 = L.marker([9.9342049,-84.1038583]).addTo(mymap);
ubicacion3.bindPopup("<b>Bicicletas de Montaña</b><br>Se pueden usar en un sendero").openPopup();*/

//llamada a AJAX - request asincronico 
$.ajax({
    dataType: "json",
    url: "api/bicicletas",
    success: function(result){
        console.log(result);
        result.bicicletas.forEach(function(bici){
            var marcador = L.marker(bici.ubicacion, {title: `ID: ${bici.id}`}).addTo(map);
            marcador.bindPopup(`<b>Bicicleta ID: ${bici.id}</b><br>Modelo: ${bici.modelo}<br>Color: ${bici.color}`).openPopup();
        });
    }
})