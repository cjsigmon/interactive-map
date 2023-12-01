const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors package

const app = express();
const PORT = 3000;

const corsOptions = {
    origin: 'http://localhost:8000', // Allow requests from localhost:8000
    credentials: true // If you need to pass credentials (cookies, authorization headers, etc.)
  };
  
  app.use(cors(corsOptions));
  

app.use('/', async (req, res) => {
  const url = 'https://ridb.recreation.gov/api/v1' + req.url;

  try {
    const response = await axios({
      method: req.method,
      url: url,
      headers: {
        ...req.headers,
      },
      data: req.body,
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
