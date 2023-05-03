import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { AwsS3Factory } from './aws-s3.factory';
import { setValueToNestedObj } from 'src/libs/utils/helper/setValueToNestedObj';

@Injectable()
export class AwsS3Service {
  private readonly s3: S3Client;
  private readonly bucketParams;

  constructor(
    private readonly awsS3Factory: AwsS3Factory,
    private readonly logger: Logger,
  ) {
    this.s3 = this.awsS3Factory.createS3Client();
    this.bucketParams = this.awsS3Factory.bucketParams;
  }

  async getBucketListObjectsCommand() {
    this.logger.log('버켓 요청', this.bucketParams);
    try {
      const data = await this.s3.send(
        new ListObjectsCommand(this.bucketParams),
      );
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
      this.logger.error('Error', err);
    }
  }

  async uploadImageToS3Bucket(buffer: Buffer, key: string): Promise<void> {
    const bucketName = this.awsS3Factory.bucketParams.Bucket;
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
    };

    try {
      await this.s3.send(new PutObjectCommand(uploadParams));
    } catch (error) {
      this.logger.error(`Error uploading image to S3: ${error}`);
      throw error;
    }
  }
}
