const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { register } = require('infrastack-sdk');

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

// Implement the GetData RPC method
function GetData(call, callback) {
  // Add tracing here if needed
  callback(null, { message: `Service 2 received: ${call.request.data}` });
}

// Implement the SendData RPC method
function SendData(call, callback) {
  // Add tracing here if needed
  callback(null, { message: `Service 2 processed: ${call.request.data}` });
}

// Start the gRPC server
function main() {
  const server = new grpc.Server();
  server.addService(serviceProto.MyService.service, { GetData, SendData });

  // Register OpenTelemetry with infrastack-sdk
  register({
    endpoint: 'https://cecqr19ofk.eu-central-1.aws.clickhouse.cloud:8443',
    serviceName: 'service2',
    serviceVersion: '1.0.0',
  });

  server.bindAsync('0.0.0.0:3002', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Service 2 running on port 3002');
    server.start();
  });
}

main();
