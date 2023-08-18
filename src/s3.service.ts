var AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_S3_BUCKET_REGION });

class AWSS3Service {
  s3;
  constructor() {
    this.s3 = new AWS.S3();
  }

  async uploadFile(fileName: string, data: Buffer | string) {
    try {
      const receivedRes = await this.s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Body: data,
          ContentType: "application/pdf",
          Key: `medical-reports/${fileName}`,
          Tagging: "public=yes",
        })
        .promise();
      return receivedRes;
    } catch (error) {
      console.log(error, "[TAX REPORT UPLOAD TO AWS S3]");
      throw error;
    }
  }
}

export default new AWSS3Service();
