const { NodeSDK } = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} = require('@opentelemetry/sdk-metrics');
const {
    OTLPTraceExporter,
  } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');


function register({ endpoint, instruments = [], serviceName, serviceVersion }) {

    const exporterOptions = {
        url: `${endpoint}/v1/traces`,
        compression: 'gzip',
      };
    const sdk = new NodeSDK({
        traceExporter:   new OTLPTraceExporter(exporterOptions),
        metricReader: new PeriodicExportingMetricReader({
          exporter: new ConsoleMetricExporter(),
        }),
        resource: new Resource({
          [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
          [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
        }),
        instrumentations: [getNodeAutoInstrumentations({ instruments })],
      });
      
      sdk.start();

  
    process.on('SIGTERM', () => {
      sdk
        .shutdown()
        .then(() => console.log('Tracing terminated'))
        .catch((error) => console.log('Error terminating tracing', error))
        .finally(() => process.exit(0));
    });
  }
  
  module.exports = { register };
  