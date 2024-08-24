const { register } = require('infrastack-sdk');

const PROTO_PATH = './service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const serviceProto = grpc.loadPackageDefinition(packageDefinition).myservice;

const server = new grpc.Server();

server.addService(serviceProto.MyService.service, {
  GetData: (call, callback) => {
    callback(null, { message: `Service 1 received: ${call.request.data}` });
  },
  SendData: (call, callback) => {
    callback(null, { message: `Service 1 processed: ${call.request.data}` });
  }
});

server.bindAsync('127.0.0.1:3001', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Service 1 running on port 3001');
  server.start();
});

register({
    endpoint: 'https://cecqr19ofk.eu-central-1.aws.clickhouse.cloud:8443', 
    serviceName: 'service1',
    serviceVersion: '1.0.0',
  });