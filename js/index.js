const moveBtn = document.getElementById("moveBtn");
const API_KEY = 'pk.eyJ1IjoiY2FsZWJqc2lnbW9uIiwiYSI6ImNscGh0Y2RtaDA1NDAycXFzMmI3ZDRuamkifQ.yzxnVlFnXxb0jjMzWlv_EQ';
var locationIndex = 0;
const worldWondersCoordinates = [
    // Coordinates for various world wonders
    // Format: [longitude, latitude]
    [-72.544962, -13.163068], // Machu Picchu, Peru
    [116.407396, 39.9042],    // Great Wall of China, China
    [29.9773, 31.1325],       // Pyramids of Giza, Egypt
    [77.7100, 20.9890],       // Taj Mahal, India
    [12.4924, 41.8902],       // Colosseum, Italy
    [34.1356, -0.7103]        // Mount Kilimanjaro, Tanzania
    // Add more wonders as needed
  ];
  

mapboxgl.accessToken = API_KEY;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: worldWondersCoordinates[locationIndex], // starting position [lng, lat]
zoom: 7, // starting zoom
});

// Create a new marker.
const marker = new mapboxgl.Marker()
    .setLngLat([-74.5, 40])
    .addTo(map);

moveBtn.addEventListener("click", function() {
    if (locationIndex < worldWondersCoordinates.length - 1) {
        locationIndex++;
    } else {
        locationIndex = 0;
    }
    map.flyTo({
        center: worldWondersCoordinates[locationIndex],
        zoom: 9,
        speed: 1,
        curve: 1,
        easing(t) {
        return t;
        }
        });
});