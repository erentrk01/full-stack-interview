require('dotenv').config();

const process = require('process');
const opentelemetry = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-grpc');
const { Resource } = require('@opentelemetry/resources');
const {
  SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');

function register({ endpoint, instruments = [], serviceName, serviceVersion }) {
  const exporterOptions = {
    url: `${endpoint}/v1/traces`,
    headers: { 'infrastack-api-key': process.env.OTEL_EXPORTER_OTLP_HEADERS.split('=')[1] },
    compression: 'gzip',
  };

  const traceExporter = new OTLPTraceExporter(exporterOptions);

  const sdk = new opentelemetry.NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations({ instrumentations })],
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName || 'default-service',
      [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion || '1.0.0',
      [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: process.env.POD_NAME ?? `uuidgen`,
    }),
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
