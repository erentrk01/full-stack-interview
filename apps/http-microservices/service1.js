// s1.js
const express = require('express');
const axios = require('axios');
const { register } = require('infrastack-sdk');

const app = express();
const port = 5001;


app.get('/trigger', async (req, res) => {
  console.log('S1: Received trigger');

  // Call S2
  try {
    const response = await axios.get('http://localhost:5002/trigger');
    res.send(`S1: Triggered S2 -> ${response.data}`);
  } catch (error) {
    res.status(500).send(`S1: Failed to trigger S2: ${error.message}`);
  }
});

app.listen(port, () => {
    // Register tracing for S1
register({
    endpoint: 'http://localhost:55681', // Replace with your tracing endpoint
    serviceName: 'service-1',
    serviceVersion: '1.0.0',
    instruments: ['http', 'express', 'mongodb'] 
  });
  
  console.log(`S1: Listening on port ${port}`);
});
