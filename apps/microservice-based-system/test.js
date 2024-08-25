const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Path to your .proto file
const PROTO_PATH = path.join(__dirname, './service.proto');

// Load the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const serviceProto = grpc.loadPackageDefinition(packageDefinition).myservice;

// Create a client instance for Service 1
const client1 = new serviceProto.MyService('localhost:3001', grpc.credentials.createInsecure());
// Create a client instance for Service 2
const client2 = new serviceProto.MyService('localhost:3002', grpc.credentials.createInsecure());

// Function to call GetData
function callGetData(data) {
  client1.GetData({ data: data }, (err, response1) => {
    if (err) {
      console.error('Error calling GetData on client1:', err);
      return;
    }
    console.log('Response from client1:', response1.message);
    
    client2.GetData({ data: data }, (err, response2) => {
      if (err) {
        console.error('Error calling GetData on client2:', err);
        return;
      }
      console.log('Response from client2:', response2.message);
    });
  });
}

// Function to call SendData
function callSendData(data) {
  client1.SendData({ data: data }, (err, response1) => {
    if (err) {
      console.error('Error calling SendData on client1:', err);
      return;
    }
    console.log('Response from client1:', response1.message);

    client2.SendData({ data: data }, (err, response2) => {
      if (err) {
        console.error('Error calling SendData on client2:', err);
        return;
      }
      console.log('Response from client2:', response2.message);
    });
  });
}

// Example usage
const dataToSend = 'Hello, gRPC!';

// Call GetData
console.log('Calling GetData...');
callGetData(dataToSend);

// Call SendData
console.log('Calling SendData...');
callSendData(dataToSend);
