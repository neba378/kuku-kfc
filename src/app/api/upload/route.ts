import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try saving to public/uploads if filesystem is writable
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Clean filename and ensure uniqueness
      const cleanName = (file.name || "image.jpg").replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueFilename = `${Date.now()}-${cleanName}`;
      const filePath = path.join(uploadsDir, uniqueFilename);

      await fs.promises.writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${uniqueFilename}`,
      });
    } catch (fsErr: unknown) {
      // In serverless environments (e.g. Vercel) where filesystem is read-only (EROFS),
      // convert to a data URL so upload still succeeds seamlessly
      const errMessage = fsErr instanceof Error ? fsErr.message : String(fsErr);
      console.warn("Filesystem write not supported in current environment:", errMessage);
      const mimeType = file.type || "image/jpeg";
      const base64 = buffer.toString("base64");
      return NextResponse.json({
        success: true,
        url: `data:${mimeType};base64,${base64}`,
      });
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to upload image";
    console.error("Upload error:", errMessage);
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Valid url required" },
        { status: 400 }
      );
    }

    // Only allow deletion of files inside /uploads/
    if (!url.startsWith("/uploads/")) {
      return NextResponse.json({ success: true });
    }

    try {
      const filename = path.basename(url);
      const filePath = path.join(process.cwd(), "public", "uploads", filename);

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (fsErr) {
      console.warn("Filesystem unlink not permitted or failed:", fsErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
