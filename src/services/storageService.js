import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { Alert } from "react-native";
import {
  S3_ENDPOINT,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
} from "@env";

// Initialize S3 client
const s3Client = new S3Client({
  forcePathStyle: true,
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
});

// Check if bucket exists
export const checkBucket = async (bucket) => {
  try {
    console.log(`Checking if bucket exists: ${bucket}`);
    const command = new HeadBucketCommand({ Bucket: bucket });
    await s3Client.send(command);
    return { exists: true, error: null };
  } catch (error) {
    console.error("Error checking bucket:", error.message);
    return { exists: false, error };
  }
};

// Upload a file to S3
export const uploadFile = async (
  bucket,
  path,
  uri,
  contentType = "image/jpeg"
) => {
  try {
    console.log(`Starting S3 file upload to bucket: ${bucket}, path: ${path}`);

    // Check if bucket exists
    const { exists, error: bucketError } = await checkBucket(bucket);
    if (!exists) {
      throw new Error(`Bucket "${bucket}" does not exist`);
    }

    // Read the file as base64
    console.log("Reading file as base64...");
    const fileBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("File read successfully");

    // Convert base64 to ArrayBuffer
    console.log("Converting to ArrayBuffer...");
    const fileArrayBuffer = decode(fileBase64);
    console.log("Conversion successful");

    // Create PutObject command
    const putCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: path,
      Body: fileArrayBuffer,
      ContentType: contentType,
    });

    // Upload using S3 client
    console.log("Uploading file via S3...");
    const response = await s3Client.send(putCommand);
    console.log("S3 upload response:", response);

    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error(
        `Upload failed with status ${response.$metadata.httpStatusCode}`
      );
    }

    // Construct the public URL
    const publicUrl = `${S3_ENDPOINT.replace(
      "/s3",
      ""
    )}/object/public/${bucket}/${path}`;
    console.log("Public URL constructed:", publicUrl);

    return {
      data: {
        path,
        publicUrl,
      },
      error: null,
    };
  } catch (error) {
    console.error("S3 upload error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    Alert.alert("Upload Error", `Failed to upload file: ${error.message}`);
    return { data: null, error };
  }
};

// Download a file from S3
export const downloadFile = async (bucket, path, destinationUri) => {
  try {
    console.log(`Downloading file from S3: ${bucket}/${path}`);

    // Create GetObject command
    const getCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: path,
    });

    // Get the object from S3
    const response = await s3Client.send(getCommand);

    // Convert the readable stream to a buffer
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Write the file to the local filesystem
    await FileSystem.writeAsStringAsync(
      destinationUri,
      buffer.toString("base64"),
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );

    return { data: { uri: destinationUri }, error: null };
  } catch (error) {
    console.error("Error downloading file:", error.message);
    Alert.alert("Download Error", `Failed to download file: ${error.message}`);
    return { data: null, error };
  }
};

// Delete a file from S3
export const deleteFile = async (bucket, path) => {
  try {
    console.log(`Deleting file from S3: ${bucket}/${path}`);

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: path,
    });

    const response = await s3Client.send(deleteCommand);

    if (response.$metadata.httpStatusCode !== 204) {
      throw new Error(
        `Delete failed with status ${response.$metadata.httpStatusCode}`
      );
    }

    return { error: null };
  } catch (error) {
    console.error("Error deleting file:", error.message);
    Alert.alert("Delete Error", `Failed to delete file: ${error.message}`);
    return { error };
  }
};

// List files in a bucket/folder
export const listFiles = async (bucket, prefix = "") => {
  try {
    console.log(`Listing files in S3: ${bucket}/${prefix}`);

    const listCommand = new ListObjectsCommand({
      Bucket: bucket,
      Prefix: prefix,
    });

    const response = await s3Client.send(listCommand);

    const files =
      response.Contents?.map((item) => ({
        name: item.Key,
        size: item.Size,
        lastModified: item.LastModified,
      })) || [];

    return { data: files, error: null };
  } catch (error) {
    console.error("Error listing files:", error.message);
    return { data: null, error };
  }
};
