const moveBtn = document.getElementById("moveBtn");
const API_KEY = 'pk.eyJ1IjoiY2FsZWJqc2lnbW9uIiwiYSI6ImNscGh0Y2RtaDA1NDAycXFzMmI3ZDRuamkifQ.yzxnVlFnXxb0jjMzWlv_EQ';
// it would be much better practice to store this API_KEY in an environment file, but since I am using vanilla JS that's not feasible.
mapboxgl.accessToken = API_KEY;

var locationIndex = 0;
const markerSet = new Set();
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
// we make and initialize a Set<int[]> here so we don't display a marker until its location is scrolled to, 
// and the set makes it easy to check if we've already rendered a marker for a particular pair of coordinates;
// thus, the markers get added as the user scrolls through the story, they stay on the page, and they do not get duplicated.
// The logic for this is performed in the nextPlace function, in the map.on('moveend') => {} lambda block.
markerSet.add(worldWonders[locationIndex].coordinates)

function offsetLeft(coordinates) {
    coordsCopy = [...coordinates];
    coordsCopy[0] += 1.8; // Adjust the longitude value to offset the center to the left
    // later, make this a variable to adjust by screen size
    return coordsCopy;
}
var centerOffset = offsetLeft(worldWonders[locationIndex].coordinates);

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: centerOffset, // starting position [lng, lat]
    zoom: 7, // starting zoom
});
// Create a new marker.
const firstMarker = new mapboxgl.Marker()
    .setLngLat(worldWonders[locationIndex].coordinates)
    .setPopup(new mapboxgl.Popup().setHTML(`<h1 class="popup">${worldWonders[locationIndex].name}</h1>`))
    .addTo(map)
    .getElement()
        .addEventListener('click', () => {
        });

function nextPlace(direction) {
  if (direction == "FORWARD") {
    if (locationIndex < worldWonders.length - 1) {
      locationIndex++;
    }
  } else if (direction == "REVERSE") {
    if (locationIndex > 0) {
      locationIndex--;
    }
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
              .setPopup(new mapboxgl.Popup().setHTML(`<h1 class="popup">${worldWonders[locationIndex].name}</h1>`))
              .addTo(map)
              .getElement()
                  .addEventListener('click', () => {
                  // each marker created should be polite enough to introduce itself when pressed for an answer.
                });
      }
  });
}     
