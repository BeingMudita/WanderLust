mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: listing.geometry.coordinates, // center map on the listing's coordinates
    zoom: 7, // starting zoom
});

// Add Marker to the map
const marker = new mapboxgl.Marker({color : "black"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25 })
        .setHTML(`<h4>${listing.location}</h4><p>Exact Location will be Provided after booking</p>`))
    .addTo(map);
