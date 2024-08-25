// s3.js
const express = require('express');
const { register } = require('infrastack-sdk');

const app = express();
const port = 5003;

app.get('/trigger', (req, res) => {
  console.log('S3: Received trigger from S2');
  res.send('S3: Trigger complete');
});

app.listen(port, () => {
    // Register tracing for S3
register({
    endpoint: 'http://localhost:55681', // Replace with your tracing endpoint
    serviceName: 'service-3',
    serviceVersion: '1.0.0',
    instruments: ['http', 'express', 'mongodb'] 
  });
  console.log(`S3: Listening on port ${port}`);
});
