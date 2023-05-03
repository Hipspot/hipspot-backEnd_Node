import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

const REGION = 'ap-northeast-2';

// Create an Amazon s3 service client object.
@Injectable()
export class AwsS3Factory {
  bucketParams: {
    Bucket: string;
    [key: string]: any;
  };

  constructor() {
    this.bucketParams = {
      Bucket: 'hipspot',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-northeast-2',
      },
    };
  }
  createS3Client(): S3Client {
    if (process.env.AWS_ACCESS_KEY) {
      return new S3Client({
        region: REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
    }
  }
}
