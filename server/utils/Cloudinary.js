import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: "dh9f2fgw0",
    api_key: "472775347823761",
    api_secret: "p1a445Ok55an4Q6WXmR9UzF3kt0",
});

export const uploadImage = async (fileBuffer) => {
    try {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto" },
                (error, result) => {
                    if (error) {
                        return reject(
                            new Error(
                                `Failed to upload image to Cloudinary: ${error.message}`
                            )
                        );
                    }
                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id,
                    });
                }
            );
            stream.end(fileBuffer);
        });
    } catch (error) {
        throw new Error(
            `Failed to upload image to Cloudinary: ${error.message}`
        );
    }
};

export const deleteImage = async (publicId) => {
    try {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(
                publicId,
                { resource_type: "image" },
                (error, result) => {
                    if (error) {
                        return reject(
                            new Error(
                                `Failed to delete image from Cloudinary: ${error.message}`
                            )
                        );
                    }
                    resolve(result);
                }
            );
        });
    } catch (error) {
        throw new Error(
            `Failed to delete image from Cloudinary: ${error.message}`
        );
    }
};
