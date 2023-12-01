console.log("test api");
const apiKey = '614a9224-d269-47df-a5ca-12e0b06bf8dd';
const url = 'https://ridb.recreation.gov/api/v1/activities?limit=50&offset=0';

fetch('http://localhost:3000/api/v1/activities?limit=50&offset=0')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data received from the API
    console.log(data);
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('There was a problem with the fetch operation:', error);
  });

 
