const moveBtn = document.getElementById("moveBtn");
const API_KEY = 'pk.eyJ1IjoiY2FsZWJqc2lnbW9uIiwiYSI6ImNscGh0Y2RtaDA1NDAycXFzMmI3ZDRuamkifQ.yzxnVlFnXxb0jjMzWlv_EQ';
var locationIndex = 0;
const markerSet = new Set();

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
  const worldWonders = [
    {
      name: 'Machu Picchu, Peru',
      coordinates: [-72.544962, -13.163068]
    },
    {
      name: 'Great Wall of China, China',
      coordinates: [116.407396, 39.9042]
    },
    {
      name: 'Pyramids of Giza, Egypt',
      coordinates: [29.9773, 31.1325]
    },
    {
      name: 'Taj Mahal, India',
      coordinates: [77.7100, 20.9890]
    },
    {
      name: 'Colosseum, Italy',
      coordinates: [12.4924, 41.8902]
    },
    {
      name: 'Mount Kilimanjaro, Tanzania',
      coordinates: [34.1356, -0.7103]
    }
    // Add more wonders as needed
  ];
markerSet.add(worldWonders[locationIndex].coordinates)

function offsetLeft(coordinates) {
    coordsCopy = [...coordinates];
    coordsCopy[0] += 1.8; // Adjust the longitude value to offset the center to the left
    return coordsCopy;
}
mapboxgl.accessToken = API_KEY;
centerOffset = offsetLeft(worldWonders[locationIndex].coordinates);
console.log(centerOffset);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: centerOffset, // starting position [lng, lat]
    zoom: 7, // starting zoom
    interactive: false,
});


// Create a new marker.
const marker = new mapboxgl.Marker()
    .setLngLat(worldWonders[locationIndex].coordinates)
    .addTo(map)
    .getElement()
        .addEventListener('click', () => {
          // Handle click events on the points
          console.log('Clicked:', worldWonders[locationIndex].name);
        });
moveBtn.addEventListener("click", function() {
    if (locationIndex < worldWonders.length - 1) {
        locationIndex++;
    } else {
        locationIndex = 0;
    }
    let cameraOffset = offsetLeft(worldWonders[locationIndex].coordinates);
    map.flyTo({
        center: cameraOffset,
        zoom: 7,
        speed: 1,
        curve: 1,
        easing(t) {
        return t;
        }
    });
    map.on('moveend', () => {
        if (!markerSet.has(worldWonders[locationIndex].coordinates)) {
            markerSet.add(worldWonders[locationIndex].coordinates);
            const marker = new mapboxgl.Marker()
                .setLngLat(worldWonders[locationIndex].coordinates)
                .addTo(map)
                .getElement()
                    .addEventListener('click', () => {
                    // Handle click events on the points
                    console.log('Clicked:', worldWonders[locationIndex].name);
                });
        }
    });
});