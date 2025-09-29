import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from env
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest) {
  try {
    // Fetch all uploaded images
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      max_results: 50, // adjust as needed
      sort_by: [{ field: "created_at", direction: "desc" }],
    });

    const images = result.resources.map((img:any) => ({
      publicId: img.public_id,
      url: img.secure_url,
      width: img.width,
      height: img.height,
      createdAt: img.created_at,
    }));

    return NextResponse.json(images);
  } catch (error) {
    console.error("Cloudinary fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images from Cloudinary" },
      { status: 500 }
    );
  }
}
