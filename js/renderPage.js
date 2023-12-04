// Function to fetch data from the API endpoint
async function fetchData(startRow, endRow) {
    try {
      const response = await fetch(`https://data.epa.gov/efservice/PUB_FACTS_SECTOR_GHG_EMISSION/year/2022/gas_id/1/ROWS/${startRow}:${endRow}/JSON`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  }
  
  // Function to extract top 15 results sorted by co2e_emission
  async function getTop15Results() {
    let COUNT = 0;
  
    try {
      const countResponse = await fetch('https://data.epa.gov/efservice/PUB_FACTS_SECTOR_GHG_EMISSION/year/2022/gas_id/1/COUNT/JSON');
      const countData = await countResponse.json();
      COUNT = countData[0].TOTALQUERYRESULTS;
      console.log("Count data:", COUNT);
  
      const topFifteenFromEachChunk = await getChunkData(COUNT);
  
      topFifteenFromEachChunk.sort((a, b) => b.co2e_emission - a.co2e_emission);
      const topFifteenOverall = topFifteenFromEachChunk.slice(0, 15);
      console.log("Top fifteen overall:", topFifteenOverall);
  
      return topFifteenOverall;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
  
  async function getChunkData(COUNT) {
    let all = [];
    let startRow = 0;
    let endRow = 1000;
  
    while (startRow < COUNT) {
      const chunk = await fetchData(startRow, endRow);
      if (chunk.length > 0) {
        // Sort the data based on co2e_emission in descending order
        chunk.sort((a, b) => b.co2e_emission - a.co2e_emission);
        // Extract the top 15 results
        const topFifteen = chunk.slice(0, 15);
        console.log("Top fifteen from chunk:", topFifteen);
        all.push(...topFifteen);
      }
      startRow += 1000;
      endRow += 1000;
    }
    return all;
  }
  
  // Call getTop15Results and log the returned value
//   getTop15Results()
//     .then((topFifteenOverall) => {
//       console.log('Top fifteen overall:', topFifteenOverall);
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
  