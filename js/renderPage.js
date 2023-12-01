var stateSet = new Set();

fetch('../data.json')
  .then(response => response.json())
  .then(data => {
    renderPage(data.RECDATA);

  })
  .catch(error => console.error('Error fetching JSON:', error));

function renderPage(facilityList) {
    for (let i = 0; i < facilityList.length; i++) {
        try {
            let stateOfFacility = facilityList[i].FACILITYADDRESS[0].AddressStateCode;
            if (!stateSet.has(stateOfFacility)) {
                stateSet.add(stateOfFacility);
                console.log((stateSet.size) + ") "+facilityList[i].FACILITYADDRESS[0].AddressStateCode + ": "+facilityList[i].FacilityName);        
            }
        } catch {
            console.log("no state code for this one...");
            console.log(facilityList[i])
        }
    }
}
