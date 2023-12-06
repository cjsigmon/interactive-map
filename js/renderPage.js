// tribal_land_id/>/0
var textIsFullScrn = false;
var mapIsFullScrn = false;
// Function to fetch data from the API endpoint
async function fetchData(startRow, endRow) {
    try {
      const response = await fetch(`https://data.epa.gov/efservice/PUB_FACTS_SECTOR_GHG_EMISSION/year/2022/gas_id/1/PUB_DIM_FACILITY/year/2022/facility_types/BEGINNING/Direct/ROWS/${startRow}:${endRow}/JSON`);
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
      const countResponse = await fetch('https://data.epa.gov/efservice/PUB_FACTS_SECTOR_GHG_EMISSION/year/2022/gas_id/1/PUB_DIM_FACILITY/year/2022/facility_types/BEGINNING/Direct/COUNT/JSON');
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
        $('#chunkP').text('Row '+startRow+' through '+endRow);
        all.push(...topFifteen);
      }
      startRow += 1000;
      endRow += 1000;
    }
    return all;
  }

  function fullscreenText() {
    if (!textIsFullScrn) {
      $('#fullscreenMap').css('visibility', 'hidden');
      $('#map').css('visibility', 'hidden');
      $('#bodyText').removeClass('col-md-6').addClass('col-md-12');
    } else {
      $('#fullscreenMap').css('visibility', 'visible');
      $('#map').css('visibility', 'visible');

      $('#bodyText').removeClass('col-md-12').addClass('col-md-6');

    }
    textIsFullScrn = !textIsFullScrn;
  }

  function fullscreenMap() {
    if (!mapIsFullScrn) {
      $('#fullscreenText').hide();
      $('#subTwo').hide();
      $('#bodyText').removeClass('col-md-6').addClass('col-md-0');
    } else {
      $('#fullscreenText').show();
      $('#subTwo').show();
      $('#bodyText').removeClass('col-md-0').addClass('col-md-6');

    }
    mapIsFullScrn = !mapIsFullScrn;
  }
  async function getWikiDesc(query) {
    const customSearchEngineId = '8315f366d46b940eb';
    const googleApiKey = 'AIzaSyBRiLHAFGHj2prk1e84nCtebLDqN32mgog';
    let summary = 'no wiki results found';
  
    try {
      const googleDescSrch = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${customSearchEngineId}&key=${googleApiKey}`;
      const response = await fetch(googleDescSrch);
      const searchData = await response.json();
      const topSearchResultLink = searchData.items[0].link;
      const topic = topSearchResultLink.substring(topSearchResultLink.lastIndexOf('/') + 1);
      const wikipediaAPI = `https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`;
      const wikiResponse = await fetch(wikipediaAPI);
      const wikiData = await wikiResponse.json();
      summary = wikiData.extract;
      return summary;
    } catch (error) {
      console.error('Error:', error);
      return summary;
    }
  }

  