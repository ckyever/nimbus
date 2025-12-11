import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: "dimm9mwzp",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = async (filePath) => {
  let results;
  try {
    results = await cloudinary.uploader.upload(filePath);
  } catch (error) {
    console.error(error);
  }

  return results.url;
};

export { upload };
