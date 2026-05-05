import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";

const s3 = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    maxAttempts: 5, // Increase retry attempts
    requestHandler: new NodeHttpHandler({
        requestTimeout: 300_000, // 5 minutes (in milliseconds)
        connectionTimeout: 300_000,
    }),
});

export default s3;
