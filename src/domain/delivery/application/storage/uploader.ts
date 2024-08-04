export interface UploadParams {
  fileName: string;
  fileType: string;
  body: Buffer;
}

export abstract class Uploader {
  // eslint-disable-next-line no-unused-vars
  abstract upload(params: UploadParams): Promise<{ url: string }>;
}
