import { NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadToDrive, appendToSheet } from "@/utils/actions";

// Ensure "uploads" directory exists
const uploadDir = path.join(process.cwd(), "src/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configure Multer for file storage
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  }),
});

// Convert multer to promise-based function
const uploadMiddleware = upload.single("resume");

// Helper to convert multer to promise
async function handleUpload(
  req: Request
): Promise<{ filePath: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    uploadMiddleware(req as any, {} as any, (err) => {
      if (err) return reject(err);
      const file = (req as any).file;
      if (!file) return reject(new Error("No file uploaded"));
      resolve({ filePath: file.path, fileName: file.filename });
    });
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phone") as string;
    const file = formData.get("resume") as File;

    if (!name || !email || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save file locally
    const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Upload to Google Drive
    const resumeUrl = await uploadToDrive(
      filePath,
      file.name,
      email,
      phoneNumber
    );

    // Save to Google Sheets
    await appendToSheet(name, email, phoneNumber, resumeUrl);

    // Delete local file after uploading
    fs.unlinkSync(filePath);

    return NextResponse.json({
      message: "Resume uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    );
  }
}
