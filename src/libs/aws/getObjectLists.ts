import { ListObjectsCommand } from '@aws-sdk/client-s3';
import { setValueToNestedObj } from '../utils/helper/setValueToNestedObj';
import { getS3Client } from './s3Client';

export const bucketParams = {
  Bucket: 'hipspot',
  CreateBucketConfiguration: {
    LocationConstraint: 'ap-northeast-2',
  },
};

export const getBucketListObjectsCommand = async () => {
  const s3Client = getS3Client();
  if (s3Client())
    try {
      const data = await s3Client().send(new ListObjectsCommand(bucketParams));
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
};
