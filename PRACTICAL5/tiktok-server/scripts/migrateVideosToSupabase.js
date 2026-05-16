/**
 * One-time script: move local /uploads videos to Supabase and update the database.
 * Run from tiktok-server folder: node scripts/migrateVideosToSupabase.js
 */
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const prisma = require("../src/lib/prisma");
const storageService = require("../src/services/storageService");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const migrate = async () => {
  const videos = await prisma.video.findMany({
    where: {
      OR: [
        { videoUrl: { startsWith: "/uploads" } },
        { videoUrl: { startsWith: "uploads/" } },
      ],
    },
  });

  console.log(`Found ${videos.length} video(s) to migrate.`);

  for (const video of videos) {
    try {
      const fileName = path.basename(video.videoUrl);
      const localPath = path.join(UPLOADS_DIR, fileName);

      if (!fs.existsSync(localPath)) {
        console.warn(`Skipping video ${video.id}: file not found at ${localPath}`);
        continue;
      }

      console.log(`Migrating video ${video.id}: ${fileName}`);

      const videoUpload = await storageService.uploadVideoFromPath(localPath);

      await prisma.video.update({
        where: { id: video.id },
        data: {
          videoUrl: videoUpload.publicUrl,
          videoStoragePath: videoUpload.storagePath,
        },
      });

      console.log(`  -> ${videoUpload.publicUrl}`);
    } catch (error) {
      console.error(`Failed to migrate video ${video.id}:`, error.message);
    }
  }

  console.log("Migration complete.");
};

migrate()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
