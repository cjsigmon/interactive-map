$(document).ready(function() {
  const moveBtn = document.getElementById("moveBtn");
  const MAPBOX_KEY = 'pk.eyJ1IjoiY2FsZWJqc2lnbW9uIiwiYSI6ImNscGh0Y2RtaDA1NDAycXFzMmI3ZDRuamkifQ.yzxnVlFnXxb0jjMzWlv_EQ';
  var ghost = 'no';
  const epa_url = 'https://data.epa.gov/efservice/PUB_FACTS_SECTOR_GHG_EMISSION/year/2022/gas_id/1/ROWS/0:15/JSON';
    const facilityUrlBase = 'https://data.epa.gov/efservice/PUB_DIM_FACILITY/year/2022/facility_id/';
    var myModal = document.getElementById('moreInfo');
    // Create a Bootstrap modal instance
    var modal = new bootstrap.Modal(myModal);

  mapboxgl.accessToken = MAPBOX_KEY;
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [5, 5], // starting position [lng, lat]
      zoom: 7 // starting zoom
  });


function openModal(emissionDetails, facilityDetails) {
    $('#moreInfoLabel').text(facilityDetails.facility_name);
  
    const GOOGLE_KEY = 'AIzaSyBRiLHAFGHj2prk1e84nCtebLDqN32mgog';
    const searchEngineId = 'a79d473b82b9c43b5';
    const facilityName = encodeURIComponent(facilityDetails.facility_name);
    const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${facilityName}&cx=${searchEngineId}&key=${GOOGLE_KEY}&searchType=image`;
  
    $.ajax({
      url: apiUrl,
      dataType: 'json',
      success: function (data) {
        const validImageItems = data.items.filter(item => {
            const url = item.link.toLowerCase();
            return url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif');
          });
        if (validImageItems.length > 0) {
            const imageUrl = validImageItems[0].link;  
          $('#modalBody').html(`
          <div class='row'>
            <div class='col-md-5'>
                <img width='400' src="${imageUrl}" alt="Facility Image">
            </div>
            <div class='col-md-7'>
                <h4>Facility Details:</h4>
                <p><strong>Facility Name:</strong> ${facilityDetails.facility_name}</p>
                <p><strong>Address:</strong> ${facilityDetails.address1}, ${facilityDetails.city}, ${facilityDetails.state} ${facilityDetails.zip}</p>
                <p><strong>County:</strong> ${facilityDetails.county} (${facilityDetails.county_fips})</p>
                <p><strong>NAICS Code:</strong> ${facilityDetails.naics_code}</p>
            </div>
          </div>
          <hr>
          <div class='row'>
            <div class='col-md-7'>
                <h4>Emission Details:</h4>
                <p><strong>CO2 Emission:</strong> ${emissionDetails.co2e_emission} metric tons</p>
                <p><strong>Year:</strong> ${emissionDetails.year}</p>
                <p><strong>Sector ID:</strong> ${emissionDetails.sector_id}</p>
                <p><strong>Subsector ID:</strong> ${emissionDetails.subsector_id}</p>
                <p><strong>Gas ID:</strong> ${emissionDetails.gas_id}</p>
            </div>
          <div class='col-md-5'></div>
      </div>
        </div>
          `);
  
          modal.show();
        } else {
          // No image found
          $('#modalBody').html(`
          <h4>Facility Details:</h4>
          <p><strong>Facility Name:</strong> ${facilityDetails.facility_name}</p>
          <p><strong>Address:</strong> ${facilityDetails.address1}, ${facilityDetails.city}, ${facilityDetails.state} ${facilityDetails.zip}</p>
          <p><strong>County:</strong> ${facilityDetails.county} (${facilityDetails.county_fips})</p>
          <p><strong>NAICS Code:</strong> ${facilityDetails.naics_code}</p>
          <hr>
          <h4>Emission Details:</h4>
          <p><strong>CO2 Emission:</strong> ${emissionDetails.co2e_emission} metric tons</p>
          <p><strong>Year:</strong> ${emissionDetails.year}</p>
          <p><strong>Sector ID:</strong> ${emissionDetails.sector_id}</p>
          <p><strong>Subsector ID:</strong> ${emissionDetails.subsector_id}</p>
          <p><strong>Gas ID:</strong> ${emissionDetails.gas_id}</p>
            <p>No image found for ${facilityDetails.facility_name}</p>
          `);
  
          modal.show();
        }
      },
      error: function () {
        // Error handling
        $('#modalBody').html(`
        <h4>Facility Details:</h4>
        <p><strong>Facility Name:</strong> ${facilityDetails.facility_name}</p>
        <p><strong>Address:</strong> ${facilityDetails.address1}, ${facilityDetails.city}, ${facilityDetails.state} ${facilityDetails.zip}</p>
        <p><strong>County:</strong> ${facilityDetails.county} (${facilityDetails.county_fips})</p>
        <p><strong>NAICS Code:</strong> ${facilityDetails.naics_code}</p>
        <hr>
        <h4>Emission Details:</h4>
        <p><strong>CO2 Emission:</strong> ${emissionDetails.co2e_emission} metric tons</p>
        <p><strong>Year:</strong> ${emissionDetails.year}</p>
        <p><strong>Sector ID:</strong> ${emissionDetails.sector_id}</p>
        <p><strong>Subsector ID:</strong> ${emissionDetails.subsector_id}</p>
        <p><strong>Gas ID:</strong> ${emissionDetails.gas_id}</p>
          <p>Error fetching image</p>
        `);
  
        modal.show();
      }
    });
  }

  var parentDiv = document.getElementById('bodyText');
  var locations = [];
  const markerSet = new Set();
  var locationIndex = 0;
  var controller = new ScrollMagic.Controller({
    globalSceneOptions: {
        triggerHook: 'onLeave',
        duration: "20%"
    }
});
  var direction;
  // Get the modal element by its ID

  fetch(epa_url)
      .then(response => response.json())
      .then(async data => {
          const pageRendered = await renderPage(data);
        //   TODO
        if (pageRendered) {
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
  
            // prepareTriggers();
        }
      })
      .catch(error => console.error('Error fetching JSON:', error));

  async function renderPage(facilityList) {
      for (let i = 0; i < facilityList.length; i++) {
        try {
            const facilityDetails = await fetchFacility(facilityList[i].facility_id);
            console.log("here is everythin about that facility");
            console.log(facilityList[i]);
            locations.push({
                coordinates: [facilityDetails.longitude, facilityDetails.latitude],
                name: facilityDetails.facility_name
            });
            addSection(facilityList[i], facilityDetails);
            if (i==0) {
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
            }
        } catch {
              // Skipping this one, it does not have a listed address
              return false;
          }
      }
      return true;
  }


  async function fetchFacility(facility_id) {
    let facilityUrl = facilityUrlBase + facility_id + '/JSON'; 
    try {
    const response = await fetch(facilityUrl);
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    const data = await response.json(); // Parsing JSON response
    return data[0]; // Returning the fetched data
  } catch (error) {
    console.error('There was a problem fetching the data:', error);
    // Handle errors or return a default value
    return null;
  }
  }
  
  function addSection(emissionDetails, facilityDetails) {
    let sectionElement = document.createElement('section');
    sectionElement.classList.add('panel');

    let divElement = document.createElement('div');
    divElement.classList.add('wonder');
    let h2Element = document.createElement('h2');
    h2Element.textContent = facilityDetails.facility_name;
    divElement.appendChild(h2Element);
    let locationP = document.createElement('p');
    console.log(facilityDetails);
    locationP.innerHTML = "Location: "+facilityDetails.city + ", "+facilityDetails.state_name;
    divElement.appendChild(locationP);
    let pElement = document.createElement('p');
    pElement.innerHTML = "CO2E Emissions: "+emissionDetails.co2e_emission;
    divElement.appendChild(pElement);
    // Creating a button
    let buttonElement = document.createElement('button');
    buttonElement.textContent = 'Open Modal';
    buttonElement.onclick = function() {
      openModal(emissionDetails, facilityDetails);
    };
    divElement.appendChild(buttonElement); 
    parentDiv.appendChild(sectionElement);
    parentDiv.appendChild(divElement);
    prepareTrigger(sectionElement);
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

  function prepareTrigger(trigger) {

        new ScrollMagic.Scene({
                triggerElement: trigger
            })
            .setPin(trigger, {
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

  function prepareTriggers() {
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


  


  
