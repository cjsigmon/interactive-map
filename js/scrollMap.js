console.log("test api");
const url = 'https://data.epa.gov/efservice/PUB_FACTS_SECTOR_GHG_EMISSION/year/2022/gas_id/1/ROWS/0:20/JSON';
const facilityUrlBase = 'https://data.epa.gov/efservice/PUB_DIM_FACILITY/year/2022/facility_id/'

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data received from the API
    console.log(data);
    iterate(data);
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('There was a problem with the fetch operation:', error);
  });

  function iterate(data) {
    for (let i=0; i<data.length; i++) {
      console.log("data[i] is "+ data[i].facility_id);
      // console.log(data[i]);
      fetchFacility(data[i].facility_id);
    }
  }


  function fetchFacility(facility_id) {
    let facilityUrl = facilityUrlBase + facility_id + '/JSON'; 

    fetch(facilityUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data received from the API
    console.log('here is that facility you wanted');
    console.log(data);
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('There was a problem with the fetch operation:', error);
  });

    return 0;
  }

 
