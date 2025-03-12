import supabase from "../utils/supabaseClient";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

// Upload a file to Supabase Storage
export const uploadFile = async (
  bucket,
  path,
  uri,
  contentType = "image/jpeg"
) => {
  try {
    // Read the file as base64
    const fileBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to ArrayBuffer
    const fileArrayBuffer = decode(fileBase64);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileArrayBuffer, {
        contentType,
        upsert: true,
      });

    if (error) throw error;

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    return { data: { ...data, publicUrl }, error: null };
  } catch (error) {
    console.error("Error uploading file:", error.message);
    return { data: null, error };
  }
};

// Download a file from Supabase Storage
export const downloadFile = async (bucket, path, destinationUri) => {
  try {
    // Get the signed URL for the file
    const {
      data: { signedUrl },
      error: signedUrlError,
    } = await supabase.storage.from(bucket).createSignedUrl(path, 60); // URL valid for 60 seconds

    if (signedUrlError) throw signedUrlError;

    // Download the file using Expo FileSystem
    const { uri, status } = await FileSystem.downloadAsync(
      signedUrl,
      destinationUri
    );

    if (status !== 200) {
      throw new Error(`Download failed with status ${status}`);
    }

    return { data: { uri }, error: null };
  } catch (error) {
    console.error("Error downloading file:", error.message);
    return { data: null, error };
  }
};

// Delete a file from Supabase Storage
export const deleteFile = async (bucket, path) => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error deleting file:", error.message);
    return { error };
  }
};

// List files in a bucket/folder
export const listFiles = async (bucket, folderPath = "") => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folderPath);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error listing files:", error.message);
    return { data: null, error };
  }
};
