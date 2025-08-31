import multer from "multer";


const storage = multer.memoryStorage();


const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  // Add explicitly if needed: "image/heic", "image/heif"
]);

const fileFilter = (req, file, cb) => {
  const type = (file.mimetype || "").toLowerCase();
  if (ALLOWED_IMAGE_MIME_TYPES.has(type)) {
    return cb(null, true);
  }
  const err = new Error("Only JPG, PNG, WEBP or GIF images are allowed");
  err.statusCode = 400;
  err.code = "INVALID_FILE_TYPE";
  return cb(err, false);
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export { upload };
