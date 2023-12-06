$(document).ready(function() {
  var jsonRef;
    var myLoadingModal = document.getElementById('loadingModal');
    var loadingModal = new bootstrap.Modal(myLoadingModal);
    loadingModal.show();


    const customMarker = document.getElementById('customMarker');


    const sectors = ["no_id","no_id","Waste","Powerplants","Refineries",
    "Chemicals","Metals","Pulp and Paper","Minerals","Coal-based Liquid Fuel Supply",
    "Petroleum Product Suppliers","Natural Gas and Natural Gas Liquids Suppliers",
    "Industrial Gas Suppliers","Suppliers of CO2","Other","Petroleum and Natural Gas Systems",
    "Import and Export of Equipment Containing Fluorintaed GHGs","Injection of CO2"
  ];
  const subsectors = [
    "DEFAULT_VALUE", // Index 0 is a default value
    "Power Plants", "Adipic Acid Production", "Aluminum Production", "Ammonia Manufacturing",
    "Cement Production", "Ferroalloy Production", "Glass Production", "HCFC-22 Prod./HFC-23 Dest.",
    "Hydrogen Production", "Iron and Steel Production", "Lead Production", "Lime Manufacturing",
    "Nitric Acid Production", "Petrochemical Production", "Petroleum Refineries",
    "Phosphoric Acid Production", "Pulp and Paper", "Silicon Carbide Production",
    "Soda Ash Manufacturing", "Titanium Dioxide Production", "Zinc Production",
    "Municipal Landfills", "Food Processing", "Ethanol Production", "Manufacturing", "Other",
    "Military", "Universities", "Other Chemicals", "Other Metals", "Other Minerals",
    "Other Paper Producers", "Producer", "Importer", "Exporter", "Producer", "Importer",
    "Exporter", "Producer", "Importer", "Exporter", "Importer", "Exporter",
    "Natural Gas Distribution", "Natural Gas Liquids Fractionation",
    "Offshore Petroleum & Natural Gas Production", "Onshore Petroleum & Natural Gas Production",
    "Natural Gas Processing", "Natural Gas Transmission/Compression",
    "Natural Gas Local Distribution Companies", "Underground Natural Gas Storage",
    "Liquefied Natural Gas Storage", "Liquefied Natural Gas Imp./Exp. Equipment",
    "Fluorinated GHG Production", "Underground Coal Mines", "Use of Electrical Equipment",
    "Electronics Manufacturing", "Electrical Equipment Manufacturers", "Magnesium",
    "Industrial Landfills", "Wastewater Treatment", "Solid Waste Combustion", "Importer",
    "Exporter", "Injection of Carbon Dioxide", "Geologic Sequestration of Carbon Dioxide",
    "CO2 Capture", "CO2 Production Wells", "Other Petroleum and Natural Gas Systems",
    "Petroleum & Natural Gas Gathering & Boosting", "Natural Gas Transmission Pipelines"
  ];

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
      style: 'mapbox://styles/mapbox/dark-v10', // Use the 'dark' style
      center: [5, 5], // starting position [lng, lat]
      zoom: 7 // starting zoom
  });

  function logI() {
    console.log(111);
  }


function openModal(emissionDetails) {
    $('#moreInfoLabel').text(emissionDetails.facility_name);
  
    const GOOGLE_KEY = 'AIzaSyBRiLHAFGHj2prk1e84nCtebLDqN32mgog';
    const searchEngineId = 'a79d473b82b9c43b5';
    const facilityName = encodeURIComponent(emissionDetails.facility_name);
    const locationDetails = encodeURIComponent(emissionDetails.address1);
    const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${facilityName}+power+plant&cx=${searchEngineId}&key=${GOOGLE_KEY}&searchType=image`;

  
  
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
                <p><strong>Facility Name:</strong> ${emissionDetails.facility_name}</p>
                <p><strong>Address:</strong> ${emissionDetails.address1}, ${emissionDetails.city}, ${emissionDetails.state} ${emissionDetails.zip}</p>
                <p><strong>County:</strong> ${emissionDetails.county} (${emissionDetails.county_fips})</p>
                <p><strong>CO2 Emission:</strong> ${emissionDetails.co2e_emission.toLocaleString()} metric tons</p>
                <p><strong>Year:</strong> ${emissionDetails.year}</p>
                <p><strong>Sector:</strong> ${sectors[emissionDetails.sector_id]}</p>
                <p><strong>Subsector:</strong> ${subsectors[emissionDetails.subsector_id]}</p>
            </div>
          </div>
          <hr>

          `);
  
          modal.show();
        } else {
          // No image found
          $('#modalBody').html(`
          <h4>Facility Details:</h4>
          <p><strong>Facility Name:</strong> ${emissionDetails.facility_name}</p>
          <p><strong>Address:</strong> ${emissionDetails.address1}, ${emissionDetails.city}, ${emissionDetails.state} ${emissionDetails.zip}</p>
          <p><strong>County:</strong> ${emissionDetails.county} (${emissionDetails.county_fips})</p>
          <hr>
          <h4>Emission Details:</h4>
          <p><strong>CO2 Emission:</strong> ${emissionDetails.co2e_emission.toLocaleString()} metric tons</p>
          <p><strong>Year:</strong> ${emissionDetails.year}</p>
          <p><strong>Sector:</strong> ${sectors[emissionDetails.sector_id]}</p>
          <p><strong>Subsector ID:</strong> ${emissionDetails.subsector_id}</p>
            <p>No image found for ${emissionDetails.facility_name}</p>
          `);
  
          modal.show();
        }
      },
      error: function () {
        // Error handling
        $('#modalBody').html(`
        <h4>Facility Details:</h4>
        <p><strong>Facility Name:</strong> ${emissionDetails.facility_name}</p>
        <p><strong>Address:</strong> ${emissionDetails.address1}, ${emissionDetails.city}, ${emissionDetails.state} ${emissionDetails.zip}</p>
        <p><strong>County:</strong> ${emissionDetails.county} (${emissionDetails.county_fips})</p>
        <hr>
        <h4>Emission Details:</h4>
        <p><strong>CO2 Emission:</strong> ${emissionDetails.co2e_emission.toLocaleString()} metric tons</p>
        <p><strong>Year:</strong> ${emissionDetails.year}</p>
        <p><strong>Sector:</strong> ${sectors[emissionDetails.sector_id]}</p>
        <p><strong>Subsector ID:</strong> ${emissionDetails.subsector_id}</p>
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

  getTop15Results()
      .then(async data => {
        jsonRef = data;
        loadingModal.hide();
          const pageRendered = await renderPage(data);
        //   TODO
        if (pageRendered) {
            markerSet.add(locations[locationIndex].coordinates);
            var centerOffset = offsetLeft(locations[locationIndex].coordinates);
            map.setCenter(centerOffset);
  
 
        }
      })
      .catch(error => console.error('Error fetching JSON:', error));

  async function renderPage(facilityList) {
      for (let i = 0; i < facilityList.length; i++) {
        try {

            locations.push({
                coordinates: [facilityList[i].longitude, facilityList[i].latitude],
                name: facilityList[i].facility_name
            });
            addSection(facilityList[i], i);
            if (i==0) {
                markerSet.add(locations[locationIndex].coordinates);
                var centerOffset = offsetLeft(locations[locationIndex].coordinates);
                map.setCenter(centerOffset);
                // Create a Mapbox marker with a popup containing HTML content
                const firstMarker = new mapboxgl.Marker(customMarker)
                  .setLngLat(locations[locationIndex].coordinates)
                  .setPopup(new mapboxgl.Popup().setHTML(`
                  <div id="popupContent">
                    <h3>Facility: ${jsonRef[i].facility_name}</h3>
                    <button class="btn btn-secondary" id="popupButton">Read more</button>
                  </div>
                  `))
                  .addTo(map);
                firstMarker.getPopup().on('open', () => {
                  const popupContent = document.getElementById('popupContent');
                  const popupButton = document.getElementById('popupButton');
                  popupButton.addEventListener('click', () => {
                    modalIndex(i);
                  });
                });
                function modalIndex(num) {
                  openModal(jsonRef[num]);
                }
            }
        } catch {
              return false;
          }
      }
      return true;
  }



  
  function addSection(emissionDetails, i) {
    let sectionElement = document.createElement('section');
    sectionElement.classList.add('panel');

    let divElement = document.createElement('div');
    divElement.classList.add('wonder');
    const divId = "location"+i;
    divElement.id = divId;
    let h2Element = document.createElement('h2');
    let thisSector = sectors[emissionDetails.sector_id];
    if (thisSector.endsWith('s')) {
      thisSector = thisSector.slice(0, -1);
    }
    h2Element.textContent = emissionDetails.facility_name + " " + thisSector;
    divElement.appendChild(h2Element);
    let locationP = document.createElement('p');

    locationP.innerHTML = "Location: "+emissionDetails.city + ", "+emissionDetails.state_name;
    divElement.appendChild(locationP);
    let pElement = document.createElement('p');
    pElement.innerHTML = "CO2E Emissions: "+emissionDetails.co2e_emission.toLocaleString() + " metric tons";
    divElement.appendChild(pElement);
    // Creating a button
    let buttonElement = document.createElement('button');
    buttonElement.classList.add('btn-primary');
    buttonElement.textContent = 'Read more';
    buttonElement.onclick = function() {
      openModal(emissionDetails);
    };
    divElement.appendChild(buttonElement); 
    parentDiv.appendChild(sectionElement);
    parentDiv.appendChild(divElement);

    // <a class="dropdown-item" href="#">Action</a>
    let dropdownItem = document.createElement('a');
    dropdownItem.classList.add('dropdown-item');
    dropdownItem.href = "#"+divId;
    dropdownItem.textContent = emissionDetails.facility_name;
    document.getElementById('dropMenu').appendChild(dropdownItem);
   
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
              const newId = "popupContent"+locationIndex;
              console.log('newId',newId);
              const marker = new mapboxgl.Marker(customMarker)
                  .setLngLat(locations[locationIndex].coordinates)
                  .setPopup(new mapboxgl.Popup().setHTML(`
                  <div id="${newId}">
                    <h3>Facility: ${jsonRef[locationIndex].facility_name}</h3>
                    <button class="btn btn-secondary popupButton" data-index="${locationIndex}">Read more</button>
                    </div>
                  `))
                  .addTo(map);

                  marker.getPopup().on('open', () => {
                    const popupContent = document.getElementById(newId);
                    const popupButtons = popupContent.getElementsByClassName('popupButton');
                    console.log('opened div len', popupButtons.length)
                    for (let i = 0; i < popupButtons.length; i++) {
                      popupButtons[i].addEventListener('click', (event) => {
                        console.log('YOU CLICKED')
                        const dataIndex = event.target.getAttribute('data-index');
                        openModal(jsonRef[dataIndex]);
                      });
                    }
                  });

                function modalIndex(num) {
                  openModal(jsonRef[num]);
                }
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
            .on("update", function(e) {
                direction = (e.target.controller().info("scrollDirection"));
            })
            .on("start end", function(e) {
                if (e.type != "start") {
                    nextPlace(direction);
                }
            });
}

});


  


  
