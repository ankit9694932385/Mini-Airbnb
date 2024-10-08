mapboxgl.accessToken = mapToken

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/satellite-streets-v12" ,  //style url 
    center:coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
 });

 const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset: 15})
        .setHTML("<h6><b> Welcome ! </b><p>Exact Location Will be Provide After Booking</p></h6>"))
        .addTo(map);