import { Test, TestingModule } from '@nestjs/testing';
import { AwsS3Service } from './aws-s3.service';
import { AwsS3Factory } from './aws-s3.factory';
import { ListObjectsCommand } from '@aws-sdk/client-s3';

// Mock S3 client 생성
class S3ClientMock {
  send(command: ListObjectsCommand): Promise<any> {
    // 테스트 용도로 사용할 목록 작성
    const sampleData = {
      Contents: [
        { Key: 'folder1/folder2/item1.jpg' },
        { Key: 'folder1/folder2/item2.jpg' },
        { Key: 'folder1/folder2/item3.jpg' },
      ],
    };
    return Promise.resolve(sampleData);
  }
}

describe('AwsS3Service', () => {
  let service: AwsS3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsS3Service,
        {
          provide: AwsS3Factory,
          useFactory: () => ({
            createS3Client: () => new S3ClientMock(),
            bucketParams: { Bucket: 'test-bucket' },
          }),
        },
      ],
    }).compile();

    service = module.get<AwsS3Service>(AwsS3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getBucketListObjectsCommand should return object with nested values', async () => {
    const expectedResult = {
      folder1: {
        folder2: ['item1.jpg', 'item2.jpg', 'item3.jpg'],
      },
    };
    const result = await service.getBucketListObjectsCommand();
    expect(result).toEqual(expectedResult);
  });
});
