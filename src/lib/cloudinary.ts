import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export { cloudinary };

export async function uploadOnCloudinary(
  file: Blob
): Promise<string | null> {
  try {
    console.log("File Type:", file.type);
    console.log("File Size:", file.size);

    const arrayBuffer = await file.arrayBuffer();

    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const dataURI = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
  folder: "vehicle-documents",
  resource_type: "image",
});

    console.log("Cloudinary Upload Success:", result.secure_url);

    return result.secure_url;
  } catch (error) {
    console.error(
  "Cloudinary Upload Error:",
  JSON.stringify(error, null, 2)
);
    return null;
  }
}