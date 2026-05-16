import supabase from "@/lib/supabase";

const VIDEOS_BUCKET = "videos";
const THUMBNAILS_BUCKET = "thumbnails";

const buildStoragePath = (fileName) => `${Date.now()}-${fileName.replace(/\s+/g, "-")}`;

/** Capture a JPEG thumbnail from the first frame of a video file */
const captureThumbnailBlob = (videoFile) =>
  new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(videoFile);

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    video.onloadeddata = () => {
      video.currentTime = 0.1;
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 568;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) {
            reject(new Error("Could not create thumbnail"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.85,
      );
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read video for thumbnail"));
    };
  });

/** Upload a file to a Supabase Storage bucket */
const uploadToBucket = async (bucket, file, contentType) => {
  const storagePath = buildStoragePath(file.name);

  const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
    contentType,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);

  return {
    storagePath,
    publicUrl: data.publicUrl,
  };
};

/**
 * Upload video + auto-generated thumbnail to Supabase.
 * Returns public URLs and storage paths for the backend API.
 */
export const uploadVideoWithThumbnail = async (videoFile) => {
  const videoResult = await uploadToBucket(
    VIDEOS_BUCKET,
    videoFile,
    videoFile.type || "video/mp4",
  );

  const thumbnailBlob = await captureThumbnailBlob(videoFile);
  const thumbnailFile = new File([thumbnailBlob], "thumbnail.jpg", {
    type: "image/jpeg",
  });

  const thumbnailResult = await uploadToBucket(
    THUMBNAILS_BUCKET,
    thumbnailFile,
    "image/jpeg",
  );

  return {
    videoUrl: videoResult.publicUrl,
    videoStoragePath: videoResult.storagePath,
    thumbnailUrl: thumbnailResult.publicUrl,
    thumbnailStoragePath: thumbnailResult.storagePath,
  };
};
