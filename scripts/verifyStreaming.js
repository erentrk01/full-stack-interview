const { trace } = require('@opentelemetry/api');
const tracer = trace.getTracer('example-tracer');

tracer.startActiveSpan('example-span', (span) => {
    span.end();
});
