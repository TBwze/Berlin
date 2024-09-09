import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(
            null,
            "C:/Users/user/OneDrive/Documents/GitHub/Berlin/server/assets/"
        );
    },
    filename: (request, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({ storage: storage });
