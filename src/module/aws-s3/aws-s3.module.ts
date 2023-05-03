import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { AwsS3Factory } from './aws-s3.factory';

@Module({
  imports: [],
  providers: [AwsS3Service, AwsS3Factory],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
