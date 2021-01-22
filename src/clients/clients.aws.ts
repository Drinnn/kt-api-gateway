import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export default class AwsClient {
  private readonly logger = new Logger(AwsClient.name);
  private readonly s3Bucket = new AWS.S3({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  public async uploadPlayerAvatarFile(file: any, playerId: string) {
    const fileRegexPattern = /\.[0-9a-z]+$/i;
    const fileExtension = file.originalname.match(fileRegexPattern);
    const urlKey = `${playerId}${fileExtension[0]}`;
    const fileParams = {
      Body: file.buffer,
      Bucket: 'kool-tennis',
      Key: urlKey,
    };

    const data = this.s3Bucket
      .putObject(fileParams)
      .promise()
      .then(
        (_data) => ({
          url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3-${process.env.AWS_S3_REGION}.amazonaws.com/${urlKey}`,
        }),
        (err) => {
          this.logger.error(err);
          return err;
        },
      );

    return data;
  }
}
