
mapboxgl.accessToken = mapToken

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v12" ,  //style url 
    center: [75.7158, 27.1656], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
 });

 const marker = new mapboxgl.Marker()
        .setLngLat([12.554729, 55.70651])
        .addTo(map);

     