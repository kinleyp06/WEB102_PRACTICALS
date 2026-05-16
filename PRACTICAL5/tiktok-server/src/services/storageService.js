// Handles all Supabase Storage operations for videos and thumbnails
const fs = require("fs");
const path = require("path");
const supabase = require("../lib/supabase");

const VIDEOS_BUCKET = "videos";
const THUMBNAILS_BUCKET = "thumbnails";

/** Build a unique storage path so files never overwrite each other */
const buildStoragePath = (originalName) => {
  const safeName = path.basename(originalName).replace(/\s+/g, "-");
  return `${Date.now()}-${safeName}`;
};

/** Return the public URL for a file in a bucket */
const getPublicUrl = (bucket, storagePath) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
};

/** Upload a video buffer/file to the "videos" bucket */
const uploadVideo = async (fileBuffer, originalName, contentType = "video/mp4") => {
  const storagePath = buildStoragePath(originalName);

  const { error } = await supabase.storage
    .from(VIDEOS_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Video upload failed: ${error.message}`);
  }

  return {
    storagePath,
    publicUrl: getPublicUrl(VIDEOS_BUCKET, storagePath),
  };
};

/** Upload a thumbnail buffer/file to the "thumbnails" bucket */
const uploadThumbnail = async (
  fileBuffer,
  originalName,
  contentType = "image/jpeg",
) => {
  const storagePath = buildStoragePath(originalName);

  const { error } = await supabase.storage
    .from(THUMBNAILS_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Thumbnail upload failed: ${error.message}`);
  }

  return {
    storagePath,
    publicUrl: getPublicUrl(THUMBNAILS_BUCKET, storagePath),
  };
};

/** Upload a video from a local file path (used by migration script) */
const uploadVideoFromPath = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const contentType = filePath.endsWith(".webm") ? "video/webm" : "video/mp4";
  return uploadVideo(buffer, path.basename(filePath), contentType);
};

/** Delete a file from Supabase Storage */
const deleteFile = async (bucket, storagePath) => {
  if (!storagePath) return;

  const { error } = await supabase.storage.from(bucket).remove([storagePath]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};

/** Delete both video and thumbnail for a database record */
const deleteVideoAssets = async (video) => {
  await deleteFile(VIDEOS_BUCKET, video.videoStoragePath);
  await deleteFile(THUMBNAILS_BUCKET, video.thumbnailStoragePath);
};

module.exports = {
  VIDEOS_BUCKET,
  THUMBNAILS_BUCKET,
  uploadVideo,
  uploadThumbnail,
  uploadVideoFromPath,
  getPublicUrl,
  deleteFile,
  deleteVideoAssets,
};
