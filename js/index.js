$(document).ready(function() {
  const moveBtn = document.getElementById("moveBtn");
  const API_KEY = 'pk.eyJ1IjoiY2FsZWJqc2lnbW9uIiwiYSI6ImNscGh0Y2RtaDA1NDAycXFzMmI3ZDRuamkifQ.yzxnVlFnXxb0jjMzWlv_EQ';
  var ghost = 'no';
  const REC_API = '934fdae4-cbd6-4730-8c69-104150aaf5cb';
  const apiUrl = 'https://ridb.recreation.gov/api/v1/facilities';
  const queryParams = new URLSearchParams({
    query: 'ghost town',
    limit: 50,
    offset: 0,
    full: true,
    radius: 24,
    lastupdated: '10-01-2023'
  });
  const url = `${apiUrl}?${queryParams.toString()}`;


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

  fetch('../data.json')
      .then(response => response.json())
      .then(data => {
          renderPage(data.RECDATA);
          markerSet.add(locations[locationIndex].coordinates);
          var centerOffset = offsetLeft(locations[locationIndex].coordinates);
          map.setCenter(centerOffset);

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
              let hasDsc = findParagraphWithPhrase(facilityList[i].FacilityDescription);
              if (!stateSet.has(stateOfFacility) && hasDsc) {


                  stateSet.add(stateOfFacility);
                  let name = stateSet.size + ") " + facilityList[i].FACILITYADDRESS[0].AddressStateCode + ": " + facilityList[i].FacilityName + ", coords: [" + facilityList[i].FacilityLatitude + "," + facilityList[i].FacilityLongitude + "]";
                  locations.push({
                      coordinates: [facilityList[i].FacilityLongitude, facilityList[i].FacilityLatitude],
                      name: name
                  });

                
                  addSection(facilityList[i].FacilityName, " "+ hasDsc + ": "+ghost);
              }
          } catch {
              // Skipping this one, it does not have a listed address
          }
      }
  }

  function findParagraphWithPhrase(arg) {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = arg;
    
    // Select all <p> elements within the div
    const paragraphs = newDiv.querySelectorAll('p');
  
    // Iterate through each <p> tag
    for (const paragraph of paragraphs) {
      const wordsArray = paragraph.textContent.split(/\s+/); // Split by whitespace
  
      // Create a Set and convert each word to lowercase before adding to the set
      const wordSet = new Set();
      wordsArray.forEach(word => {
        wordSet.add(word.toLowerCase());
      });
  
      // Check if 'ghost' is in the set
      if (wordSet.has('ghost') && !wordSet.has('holy')) {
        // If 'ghost' is found, assign the paragraph text to ghost and return true
        ghost = paragraph.textContent;
        return true;
      }
    }
  
    // If 'ghost' is not found in any paragraph, return false
    return false;
  }
  

  function addSection(title, description) {
      let sectionElement = document.createElement('section');
      sectionElement.classList.add('panel');
      let divElement = document.createElement('div');
      divElement.classList.add('wonder');
      let h2Element = document.createElement('h2');
      h2Element.textContent = title;
      divElement.appendChild(h2Element);
      let pElement = document.createElement('p');
      pElement.innerHTML = description;
      divElement.appendChild(pElement);
      parentDiv.appendChild(sectionElement);
      parentDiv.appendChild(divElement);
  }

  function offsetLeft(coordinates) {
      let coordsCopy = [...coordinates];
      coordsCopy[0] += 1.8; // Adjust the longitude value to offset the center to the left
      // Later, make this a variable to adjust by screen size
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
          curve: 1.7,
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
                      // Each marker created should introduce itself when pressed for an answer.
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
      // Create scene for every slide
      for (var i = 0; i < slides.length; i++) {
          new ScrollMagic.Scene({
                  triggerElement: slides[i]
              })
              .setPin(slides[i], {
                  pushFollowers: false
              })
              .addTo(controller)
              .addIndicators()
              .on("update", function(e) {
                  direction = (e.target.controller().info("scrollDirection"));
              })
              .on("start end", function(e) {
                  if (e.type != "start") {
                      nextPlace(direction);
                  }
              });
      }
  }
});
