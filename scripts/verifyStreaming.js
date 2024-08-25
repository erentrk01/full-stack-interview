const { register } = require('infrastack-sdk');
const { ClickHouse } = require('clickhouse');

async function sendTrace() {
    try {
        console.log("Registering tracing...");

        // Register tracing with infrastack-sdk
        await register({
            endpoint: 'https://cecqr19ofk.eu-central-1.aws.clickhouse.cloud:8443',
            serviceName: 'test-service',
            serviceVersion: '1.0.0',
        });

        console.log("Tracing registered successfully. Sending test trace...");

        // Simulate some work
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log("Test trace completed.");

        // Verify that the trace data is saved in ClickHouse
        await verifyDataInClickHouse();
    } catch (err) {
        console.error("Failed to register tracing or send/verify trace:", err);
    } finally {
        process.exit(0);
    }
}

async function verifyDataInClickHouse() {
    try {
        console.log("Verifying data in ClickHouse...");

        // Connect to ClickHouse
        const clickhouse = new ClickHouse({
            url: 'https://cecqr19ofk.eu-central-1.aws.clickhouse.cloud',
            port: 8443,
            basicAuth: {
                username: 'default', 
                password: 'secret ', 
            },
            debug: false,
            isUseGzip: true,
            format: "json",
            config: {
                session_timeout: 60,
                database: 'default',
            },
        });

        // Example query to verify if data was saved
        const query = `
            SELECT COUNT(*) AS trace_count 
            FROM test_traces  
            WHERE service_name = 'test-service' 
            AND service_version = '1.0.0'
            AND timestamp >= now() - INTERVAL 1 MINUTE`;

        const result = await clickhouse.query(query).toPromise();

        if (result[0].trace_count > 0) {
            console.log("Data verified: Trace successfully saved in ClickHouse.");
        } else {
            console.warn("Warning: No trace data found in ClickHouse.");
        }
    } catch (err) {
        console.error("Failed to verify data in ClickHouse:", err);
    }
}

sendTrace();
