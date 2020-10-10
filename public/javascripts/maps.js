var mymap = L.map('mapid').setView([9.933662,-84.1105192], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

L.marker([9.9365915,-84.1080593]).addTo(mymap);
L.marker([9.9346707,-84.1076373]).addTo(mymap);
L.marker([9.9342049,-84.1038583]).addTo(mymap);
