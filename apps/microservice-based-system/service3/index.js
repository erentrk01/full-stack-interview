const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { register } = require('infrastack-sdk');

const PROTO_PATH = './service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const serviceProto = grpc.loadPackageDefinition(packageDefinition).myservice;

const client1 = new serviceProto.MyService('localhost:50051', grpc.credentials.createInsecure());
const client2 = new serviceProto.MyService('localhost:50052', grpc.credentials.createInsecure());

const server = new grpc.Server();

server.addService(serviceProto.MyService.service, {
  GetData: (call, callback) => {
    client1.GetData(call.request, (err, response1) => {
      if (err) return callback(err);
      client2.GetData(call.request, (err, response2) => {
        if (err) return callback(err);
        callback(null, { message: `Service 3 received responses: ${response1.message} and ${response2.message}` });
      });
    });
  },
  SendData: (call, callback) => {
    client1.SendData(call.request, (err, response1) => {
      if (err) return callback(err);
      client2.SendData(call.request, (err, response2) => {
        if (err) return callback(err);
        callback(null, { message: `Service 3 processed responses: ${response1.message} and ${response2.message}` });
      });
    });
  }
});

server.bindAsync('127.0.0.1:50053', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Service 3 running on port 50053');
  server.start();
});

register({
  endpoint: 'https://cecqr19ofk.eu-central-1.aws.clickhouse.cloud:8443',
  serviceName: 'service3',
});
