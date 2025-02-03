import { google } from "googleapis";
import fs from "fs";

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
];
const auth = new google.auth.GoogleAuth({
  keyFile: "src/utils/credentials.json",
  scopes: SCOPES,
});
const FOLDER_ID = process.env.FOLDER_ID || "";
const SHEET_ID = process.env.SHEET_ID;

// Function to delete an entry in Google Sheets and its associated resume in Google Drive
async function removeExistingEntry(email: string, phone: string) {
  const sheets = google.sheets({ version: "v4", auth });

  // Fetch the existing sheet data
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "Sheet1!A:D",
  });

  const rows = response.data.values || [];
  let rowIndexToDelete = -1;
  let fileIdToDelete = "";

  // Loop through the rows to find a match
  for (let i = 0; i < rows.length; i++) {
    const [name, existingEmail, existingPhone, resumeUrl] = rows[i];

    if (existingEmail === email && existingPhone === phone) {
      rowIndexToDelete = i + 1; // Google Sheets row indexes start from 1
      fileIdToDelete = extractFileId(resumeUrl);
      break;
    }
  }

  // If a matching entry was found, delete the row and associated Drive file
  if (rowIndexToDelete !== -1) {
    await deleteSheetRow(rowIndexToDelete);
    if (fileIdToDelete) {
      await deleteFileFromDrive(fileIdToDelete);
    }
  }
}

// Extract Google Drive File ID from URL
function extractFileId(resumeUrl: string): string {
  const match = resumeUrl.match(/\/d\/(.*?)\//);
  return match ? match[1] : "";
}

// Delete a row from Google Sheets
async function deleteSheetRow(rowIndex: number) {
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0, // Default to first sheet (adjust if needed)
              dimension: "ROWS",
              startIndex: rowIndex - 1, // Google Sheets uses zero-based index
              endIndex: rowIndex,
            },
          },
        },
      ],
    },
  });
}

// Delete file from Google Drive
async function deleteFileFromDrive(fileId: string) {
  const drive = google.drive({ version: "v3", auth });
  await drive.files.delete({ fileId });
}

// Upload file to Google Drive
export async function uploadToDrive(
  filePath: string,
  fileName: string,
  email: string,
  phone: string
) {
  const drive = google.drive({ version: "v3", auth });

  // Remove existing entry before uploading a new one
  await removeExistingEntry(email, phone);

  // Upload new resume
  const response = await drive.files.create({
    requestBody: { name: fileName, parents: [FOLDER_ID] },
    media: { mimeType: "application/pdf", body: fs.createReadStream(filePath) },
  });

  await drive.permissions.create({
    fileId: response.data.id || "",
    requestBody: { role: "reader", type: "anyone" },
  });

  return `https://drive.google.com/file/d/${response.data.id}/view`;
}

// Append Data to Google Sheets
export async function appendToSheet(
  name: string,
  email: string,
  phone: string,
  resumeUrl: string
) {
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: "Sheet1!A:D",
    valueInputOption: "RAW",
    requestBody: { values: [[name, email, phone, resumeUrl]] },
  });
}
