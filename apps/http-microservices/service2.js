// s2.js
const express = require('express');
const axios = require('axios');
const { register } = require('infrastack-sdk');

const app = express();
const port = 5002;



app.get('/trigger', async (req, res) => {
  console.log('S2: Received trigger from S1');

  // Call S3
  try {
    const response = await axios.get('http://localhost:5003/trigger');
    res.send(`S2: Triggered S3 -> ${response.data}`);
  } catch (error) {
    res.status(500).send(`S2: Failed to trigger S3: ${error.message}`);
  }
});

app.listen(port, () => {
    register({
        endpoint: 'http://localhost:55681', // Replace with your tracing endpoint
        serviceName: 'service-2',
        serviceVersion: '1.0.0',
        instruments: ['http', 'express', 'mongodb'] 
      });
      
  console.log(`S2: Listening on port ${port}`);
});
