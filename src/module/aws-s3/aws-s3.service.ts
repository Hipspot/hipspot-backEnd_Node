import { Injectable } from '@nestjs/common';
import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';
import { AwsS3Factory } from './aws-s3.factory';
import { setValueToNestedObj } from 'src/libs/utils/helper/setValueToNestedObj';

@Injectable()
export class AwsS3Service {
  private readonly s3: S3Client;

  constructor(private readonly awsS3Factory: AwsS3Factory) {
    this.s3 = this.awsS3Factory.createS3Client();
  }

  async getBucketListObjectsCommand() {
    const bucketParams = this.awsS3Factory.bucketParams;
    try {
      const data = await this.s3.send(new ListObjectsCommand(bucketParams));
      const result = {};
      for (const obj of data.Contents) {
        const { Key } = obj;
        const path = Key.split('/');
        const value = path.pop() || null;
        if (path.length != 2) continue;
        setValueToNestedObj(result, path, value);
      }
      return result;
    } catch (err) {
      console.log('Error', err);
    }
  }
}
