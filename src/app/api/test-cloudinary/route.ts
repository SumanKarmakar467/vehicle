import { cloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    const result = await cloudinary.uploader.upload(
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/JPEG_example_flower.jpg",
      {
        folder: "vehicle-test",
      }
    );

    return Response.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: any) {
    console.error("TEST UPLOAD ERROR:", error);

    return Response.json(
      {
        message: error?.message,
        name: error?.name,
        http_code: error?.http_code,
        error,
      },
      { status: 500 }
    );
  }
}