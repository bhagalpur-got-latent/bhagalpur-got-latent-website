import { google } from "googleapis";
import { Readable } from "stream";

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
];

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Ensure proper formatting
  },
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });
const sheets = google.sheets({ version: "v4", auth });

// Function to remove existing entry (if any)
async function removeExistingEntry(email: string, phone: string) {
  try {
    // Fetch sheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A:D",
    });

    const rows = response.data.values || [];
    let rowIndexToDelete = -1;
    let fileIdToDelete = "";

    // Search for matching entry
    for (let i = 0; i < rows.length; i++) {
      const [name, existingEmail, existingPhone, resumeUrl] = rows[i];

      if (existingEmail === email && existingPhone === phone) {
        rowIndexToDelete = i + 1; // Google Sheets rows are 1-indexed
        fileIdToDelete = extractFileId(resumeUrl);
        break;
      }
    }

    // If an entry exists, delete the row and associated file
    if (rowIndexToDelete !== -1) {
      await deleteSheetRow(rowIndexToDelete);
      if (fileIdToDelete) {
        await deleteFileFromDrive(fileIdToDelete);
      }
    }
  } catch (error) {
    console.error("Error removing existing entry:", error);
    throw error;
  }
}

// Extract file ID from Google Drive URL
function extractFileId(resumeUrl: string): string {
  const match = resumeUrl.match(/\/d\/(.*?)\//);
  return match ? match[1] : "";
}

// Delete a row from Google Sheets
async function deleteSheetRow(rowIndex: number) {
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: process.env.SHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0, // Adjust if necessary
              dimension: "ROWS",
              startIndex: rowIndex - 1,
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
  await drive.files.delete({ fileId });
}

// Upload the file to Google Drive and update Google Sheets
export async function uploadToDrive(fileBuffer: Buffer, fileName: string, email: string, phone: string) {
  try {
    // Make sure FOLDER_ID is set
    if (!process.env.FOLDER_ID) {
      throw new Error("FOLDER_ID is not defined in environment variables");
    }

    // Convert Buffer to Readable Stream
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);

    // Remove any existing entry before uploading the new file
    await removeExistingEntry(email, phone);

    // Upload new resume file to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [process.env.FOLDER_ID],  // Ensure the folder ID is correctly passed
      },
      media: {
        mimeType: "application/pdf",
        body: bufferStream,  // Pass the buffer stream
      },
    });

    // Set the permissions to make the file readable by anyone
    await drive.permissions.create({
      fileId: response.data.id || "",
      requestBody: { role: "reader", type: "anyone" },
    });

    // Return the URL of the uploaded file
    return `https://drive.google.com/file/d/${response.data.id}/view`;
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    throw error;
  }
}

// Append data to Google Sheets
export async function appendToSheet(name: string, email: string, phone: string, resumeUrl: string) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A:D",
      valueInputOption: "RAW",
      requestBody: { values: [[name, email, phone, resumeUrl]] },
    });

    console.log("Data appended successfully to Google Sheets");
  } catch (error) {
    console.error("Error appending data to Google Sheets:", error);
    throw error;
  }
}
