import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, 
});

export const uploadSingle = upload.single("profilePicture");
