import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadStream } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { resolve } from "path";
import { PrismaClient } from "../../../../generated/prisma";

//whatever video we are uploading to cloudinary , we need to upload the same video to the neondb database as well so that we can get unique id , public id and other attributes designed


const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
  bytes : number;
  duration?: number;
}


export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //checking Cloudinary credentials
  if(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET){
    return NextResponse.json({error:"Cloudinary credentials not found"},{status:400});
  }
  
  try{
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const duration = formData.get("duration") as string | null;
    const originalSize = formData.get("originalSize") as string | null;
    const compressedSize = formData.get("compressedSize") as string | null;

    if(!title || !description|| !duration || !originalSize){
      return NextResponse.json({error:"Missing required fields"},{status:400});
    }

    if(!file){
      return NextResponse.json({error:"File not found"},{status:400});
    }

    const bytes = await file.arrayBuffer();
    //.arrayBuffer is a method on File that returns a promise resolving to ArrayBuffer
    //An ArrayBuffer is a raw,low-level representation of binary data(just bytes in memory,no structure)
    const buffer = Buffer.from(bytes);
    //Node.js class for handling raw binary data
    //acts as a wrapper class and is easier to work with APIs
    
    const result: CloudinaryUploadResult = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            resource_type: "video",
            folder: "next-cloudinary-uploads" ,
            transformation: [
              {quality: "auto", fetch_format:"mp4"},
            ]
          
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );

        uploadStream.end(buffer); // ✅ Correct way
      }
    );
    
    const video = await prisma.video.create({
      data: {
        title,
        description,
        duration: Number(duration),
        originalSize: originalSize,
        compressedSize: String(result.bytes),
        publicId: result.public_id,
      },
    })

    return NextResponse.json(video);


  }catch(error)
  { 
    console.log(error)

    return NextResponse.json({error:"Upload video failed"},{status:500})
  }finally{
    await prisma.$disconnect();
  }
}
