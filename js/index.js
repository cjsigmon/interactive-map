$(document).ready(function() {
  const moveBtn = document.getElementById("moveBtn");
  const API_KEY = 'pk.eyJ1IjoiY2FsZWJqc2lnbW9uIiwiYSI6ImNscGh0Y2RtaDA1NDAycXFzMmI3ZDRuamkifQ.yzxnVlFnXxb0jjMzWlv_EQ';
  // it would be much better practice to store this API_KEY in an environment file, but since I am using vanilla JS that's not feasible.
  mapboxgl.accessToken = API_KEY;
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [5, 5], // starting position [lng, lat]
    zoom: 7 // starting zoom
});
  
  var stateSet = new Set();
  var parentDiv = document.getElementById('bodyText');
  var locations = [];
  const markerSet = new Set();
  var locationIndex = 0;
  
  var controller = new ScrollMagic.Controller();
  var direction;
  
  // we make and initialize a Set<int[]> here so we don't display a marker until its location is scrolled to, 
  // and the set makes it easy to check if we've already rendered a marker for a particular pair of coordinates;
  // thus, the markers get added as the user scrolls through the story, they stay on the page, and they do not get duplicated.
  // The logic for this is performed in the nextPlace function, in the map.on('moveend') => {} lambda block.
  fetch('../data.json')
  .then(response => response.json())
  .then(data => {
    renderPage(data.RECDATA);
    console.log(data.RECDATA);
    markerSet.add(locations[locationIndex].coordinates);
    var centerOffset = offsetLeft(locations[locationIndex].coordinates);
  map.setCenter(centerOffset);

// Create a new marker.
const firstMarker = new mapboxgl.Marker()
    .setLngLat(locations[locationIndex].coordinates)
    .setPopup(new mapboxgl.Popup().setHTML(`<p class="popup">${locations[locationIndex].name}</p>`))
    .addTo(map)
    .getElement()
    .addEventListener('click', () => {
        // Your click event logic goes here
    });

  prepareTriggers(); 

  })
  .catch(error => console.error('Error fetching JSON:', error));



  function renderPage(facilityList) {
    for (let i = 0; i < facilityList.length; i++) {
        try {
            let stateOfFacility = facilityList[i].FACILITYADDRESS[0].AddressStateCode;
            if (!stateSet.has(stateOfFacility)) {
                stateSet.add(stateOfFacility);
                let name = stateSet.size + ") "+facilityList[i].FACILITYADDRESS[0].AddressStateCode + ": "+facilityList[i].FacilityName + ", coords: ["+facilityList[i].FacilityLatitude+","+facilityList[i].FacilityLongitude+"]";  
                locations.push({
                    coordinates: [facilityList[i].FacilityLongitude, facilityList[i].FacilityLatitude],
                    name: name
                });
                addSection();


            }
        } catch {
            // skipping this one, it does not have a listed address
        }
    }
}

function addSection() {
    let sectionElement = document.createElement('section');
    sectionElement.classList.add('panel');
    let divElement = document.createElement('div');
    divElement.classList.add('wonder');
    let h2Element = document.createElement('h2');
    h2Element.textContent = 'The Enigmatic Ruins of Machu Picchu, Peru';
    divElement.appendChild(h2Element);
    let pElement = document.createElement('p');
    pElement.textContent = 'Perched high in the Andes Mountains, Machu Picchu, often referred to as the "Lost City of the Incas," stands as an awe-inspiring testament to ancient engineering and spiritual significance. Nestled amidst mist-laden peaks, this 15th-century citadel remains a testament to the Incan civilization\'s ingenuity. Its intricate stone constructions, including the Temple of the Sun and the Intihuatana stone, create an air of mystery and cultural reverence, inviting visitors to ponder its purpose and historical significance.';
    divElement.appendChild(pElement);
    parentDiv.appendChild(sectionElement);
    parentDiv.appendChild(divElement);
}

function offsetLeft(coordinates) {
    coordsCopy = [...coordinates];
    coordsCopy[0] += 1.8; // Adjust the longitude value to offset the center to the left
    // later, make this a variable to adjust by screen size
    return coordsCopy;
}

function nextPlace(direction) {
  if (direction == "FORWARD") {
    if (locationIndex < locations.length - 1) {
      locationIndex++;
    }
  } else if (direction == "REVERSE") {
    if (locationIndex > 0) {
      locationIndex--;
    }
  }
  let cameraOffset = offsetLeft(locations[locationIndex].coordinates);
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
      if (!markerSet.has(locations[locationIndex].coordinates)) {
          markerSet.add(locations[locationIndex].coordinates);
          const marker = new mapboxgl.Marker()
              .setLngLat(locations[locationIndex].coordinates)
              .setPopup(new mapboxgl.Popup().setHTML(`<p class="popup">${locations[locationIndex].name}</p>`))
              .addTo(map)
              .getElement()
                  .addEventListener('click', () => {
                  // each marker created should be polite enough to introduce itself when pressed for an answer.
                });
      }
  });
}  

function prepareTriggers() {
  var controller = new ScrollMagic.Controller({
      globalSceneOptions: {
          triggerHook: 'onLeave',
          duration: "20%"
      }
  });
  var slides = document.querySelectorAll("section.panel");
  // create scene for every slide
  for (var i=0; i<slides.length; i++) {
      new ScrollMagic.Scene({
              triggerElement: slides[i]
          })
          .setPin(slides[i], {pushFollowers: false})
          .addTo(controller)
          .addIndicators() 
          .on("update", function (e) {
              direction = (e.target.controller().info("scrollDirection"));
          })
          .on("start end", function (e) {
              console.log(direction);
              if (e.type != "start") {
                  nextPlace(direction);
              }
          });
  }
}






});




