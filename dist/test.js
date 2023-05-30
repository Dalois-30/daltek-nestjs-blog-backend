"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const REGION = "us-east-1";
const BUCKET_NAME = "blogdalois";
const PREFIX = "photo/";
const s3 = new client_s3_1.S3Client({ region: REGION });
async function listImageUrls() {
    var _a;
    try {
        const command = new client_s3_1.ListObjectsCommand({
            Bucket: BUCKET_NAME,
            Prefix: PREFIX,
        });
        const result = await s3.send(command);
        const urls = (_a = result.Contents) === null || _a === void 0 ? void 0 : _a.map((object) => `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${object.Key}`);
        console.log(urls);
    }
    catch (error) {
        console.error(error);
    }
}
listImageUrls();
async function getSignedImageUrls() {
    const s3 = new client_s3_1.S3Client({ region: REGION });
    try {
        const listObjectsCommand = new client_s3_1.ListObjectsCommand({ Bucket: BUCKET_NAME, Prefix: PREFIX });
        const listObjectsResult = await s3.send(listObjectsCommand);
        const contents = listObjectsResult.Contents || [];
        const presignedUrls = await Promise.all(contents.map(async (object) => {
            const urlParams = {
                Bucket: BUCKET_NAME,
                Key: object.Key
            };
            const getCommand = new client_s3_1.GetObjectCommand(urlParams);
            const presignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3, getCommand, { expiresIn: 3600 });
            return presignedUrl;
        }));
        console.log(presignedUrls);
        return presignedUrls;
    }
    catch (err) {
        console.log('Error', err);
        return [];
    }
}
getSignedImageUrls();
//# sourceMappingURL=test.js.map