const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the protobuf
const PROTO_PATH = './service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const serviceProto = grpc.loadPackageDefinition(packageDefinition).myservice;

// Create gRPC clients for each service
const client1 = new serviceProto.MyService('localhost:3001', grpc.credentials.createInsecure());
const client2 = new serviceProto.MyService('localhost:3002', grpc.credentials.createInsecure());
const client3 = new serviceProto.MyService('localhost:3003', grpc.credentials.createInsecure());

// Function to call GetData on all services
function testGetData() {
    const callOptions = {
        deadline: new Date(Date.now() + 10000) // 10 seconds
    };
    const requestData = { data: 'Test data for GetData' };

    client1.GetData(requestData, callOptions, (err, response) => {
        if (err) {
            console.error('Error in Service 1 GetData:', err);
        } else {
            console.log('Service 1 GetData response:', response.message);
        }

        client2.GetData(requestData, callOptions, (err, response) => {
            if (err) {
                console.error('Error in Service 2 GetData:', err);
            } else {
                console.log('Service 2 GetData response:', response.message);
            }

            client3.GetData(requestData, callOptions, (err, response) => {
                if (err) {
                    console.error('Error in Service 3 GetData:', err);
                } else {
                    console.log('Service 3 GetData response:', response.message);
                }
            });
        });
    });
}

// Function to call SendData on all services
function testSendData() {
    const requestData = { data: 'Test data for SendData' };

    client1.SendData(requestData, (err, response) => {
        if (err) console.error('Error in Service 1 SendData:', err);
        else console.log('Service 1 SendData response:', response.message);

        client2.SendData(requestData, (err, response) => {
            if (err) console.error('Error in Service 2 SendData:', err);
            else console.log('Service 2 SendData response:', response.message);

            client3.SendData(requestData, (err, response) => {
                if (err) console.error('Error in Service 3 SendData:', err);
                else console.log('Service 3 SendData response:', response.message);
            });
        });
    });
}

// Call the test functions
testGetData();
testSendData();
