import { S3Client } from '@aws-sdk/client-s3';
// Create the parameters for the bucket
// Set the AWS Region.

const REGION = 'ap-northeast-2';

// Create an Amazon S3 service client object.
export const getS3Client = () => {
  const s3 = { client: null };
  return () => {
    if (process.env.AWS_ACCESS_KEY && !s3.client) {
      s3.client = new S3Client({
        region: REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
    }
    return s3.client;
  };
};
