import supabase from "../utils/supabaseClient";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { Alert } from "react-native";

// Check if required storage buckets exist
export const checkStorageBuckets = async () => {
  try {
    console.log("Checking storage buckets...");

    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("Error listing buckets:", error.message);
      return {
        avatarsExists: false,
        workoutImagesExists: false,
        profileImagesExists: false,
        error,
      };
    }

    // Check if required buckets exist
    const avatarsExists = buckets.some((bucket) => bucket.name === "avatars");
    const workoutImagesExists = buckets.some(
      (bucket) => bucket.name === "workout-images"
    );
    const profileImagesExists = buckets.some(
      (bucket) => bucket.name === "profile-images"
    );

    console.log("Storage buckets check results:", {
      avatarsExists,
      workoutImagesExists,
      profileImagesExists,
      availableBuckets: buckets.map((b) => b.name).join(", "),
    });

    return {
      avatarsExists,
      workoutImagesExists,
      profileImagesExists,
      error: null,
    };
  } catch (error) {
    console.error("Error checking storage buckets:", error.message);
    return {
      avatarsExists: false,
      workoutImagesExists: false,
      profileImagesExists: false,
      error,
    };
  }
};

// Upload a file to Supabase Storage
export const uploadFile = async (
  bucket,
  path,
  uri,
  contentType = "image/jpeg"
) => {
  try {
    // Check if bucket exists first
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError.message);
      return { data: null, error: bucketsError };
    }

    const bucketExists = buckets.some((b) => b.name === bucket);

    if (!bucketExists) {
      const error = new Error(
        `Storage bucket "${bucket}" does not exist. Please set up your Supabase storage buckets.`
      );
      console.error(error.message);
      Alert.alert(
        "Storage Error",
        `The storage bucket "${bucket}" is not set up. Please contact the administrator.`
      );
      return { data: null, error };
    }

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

    if (error) {
      console.error("Error uploading file:", error.message);
      Alert.alert(
        "Upload Error",
        "Failed to upload the file. Please try again later."
      );
      return { data: null, error };
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    return { data: { ...data, publicUrl }, error: null };
  } catch (error) {
    console.error("Error uploading file:", error.message);
    Alert.alert(
      "Upload Error",
      "An unexpected error occurred while uploading the file."
    );
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
