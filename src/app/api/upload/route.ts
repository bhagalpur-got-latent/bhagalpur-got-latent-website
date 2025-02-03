import { NextRequest, NextResponse } from "next/server";
import { uploadToDrive, appendToSheet } from "@/utils/actions";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("resume") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to Google Drive using Buffer
    const resumeUrl = await uploadToDrive(buffer, file.name, email, phone);

    // Append user details to Google Sheets
    await appendToSheet(name, email, phone, resumeUrl);

    return NextResponse.json({ message: "Resume uploaded successfully", resumeUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
