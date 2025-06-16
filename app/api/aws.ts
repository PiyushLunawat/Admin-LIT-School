import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import axios from "axios";

// Reusable S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
});
interface UploadDirectParams {
  file: File;
  fileKey: string;
  onProgress: (progress: number) => void;
}
interface UploadMultipartParams {
  file: File;
  fileKey: string;
  chunkSize: number;
  onProgress: (percentComplete: number) => void;
}
interface DeleteS3ObjectParams {
  fileKey: string;
}

// s3 Direct Upload
export const uploadDirect = async ({
  file,
  fileKey,
  onProgress,
}: UploadDirectParams): Promise<string> => {
  const { data } = await axios.post(
    `${process.env.API_URL}/student/generate-presigned-url`,
    {
      bucketName: `${process.env.NEXT_PUBLIC_AWS_BUCKET}`,
      key: fileKey,
    }
  );

  const { url } = data;

  await axios.put(url, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: (evt: any) => {
      if (!evt.total) return;
      const percentComplete = Math.round((evt.loaded / evt.total) * 100);
      onProgress(percentComplete);
    },
  });

  return fileKey;
};

// s3 MultiPart Upload
export const uploadMultipart = async ({
  file,
  chunkSize,
  fileKey,
  onProgress,
}: UploadMultipartParams): Promise<string> => {
  const initiateRes = await axios.post(
    `${process.env.API_URL}/admin/initiate-multipart-upload`,
    {
      bucketName: `${process.env.NEXT_PUBLIC_AWS_BUCKET}`,
      key: fileKey,
    }
  );

  const { uploadId } = initiateRes.data;

  const totalChunks = Math.ceil(file.size / chunkSize);
  let totalBytesUploaded = 0;
  const parts: { ETag: string; PartNumber: number }[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const partRes = await axios.post(
      `${process.env.API_URL}/admin/generate-presigned-url-part`,
      {
        bucketName: `${process.env.NEXT_PUBLIC_AWS_BUCKET}`,
        key: fileKey,
        uploadId,
        partNumber: i + 1,
      }
    );

    const { url } = partRes.data;

    const uploadRes = await axios.put(url, chunk, {
      headers: { "Content-Type": file.type },
      onUploadProgress: (evt: any) => {
        if (!evt.total) return;
        totalBytesUploaded += evt.loaded;
        const percent = Math.round((totalBytesUploaded / file.size) * 100);
        onProgress?.(percent);
      },
    });

    parts.push({ PartNumber: i + 1, ETag: uploadRes.headers.etag });
  }

  await axios.post(`${process.env.API_URL}/admin/complete-multipart-upload`, {
    bucketName: `${process.env.NEXT_PUBLIC_AWS_BUCKET}`,
    key: fileKey,
    uploadId,
    parts,
  });

  return fileKey;
};

// s3 Delete
export const deleteS3Object = async ({
  fileKey,
}: DeleteS3ObjectParams): Promise<void> => {
  try {
    if (!fileKey) {
      throw new Error("Invalid file key");
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: `${process.env.NEXT_PUBLIC_AWS_BUCKET}`,
      Key: fileKey,
    });

    await s3Client.send(deleteCommand);
    console.log(`File deleted successfully from S3: ${fileKey}`);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw new Error("Failed to delete file from S3");
  }
};
