import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

// Disable automatic body parsing by Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to convert Request to Node.js Readable stream
function requestToReadableStream(req: Request): Readable {
  const readableStream = new Readable();
  readableStream._read = () => {}; // No-op
  req.body?.getReader().read().then(({ done, value }) => {
    if (done) readableStream.push(null); // No more data to push
    else readableStream.push(value);
  });
  return readableStream;
}

// File upload handler
export async function POST(req: Request) {
  const uploadDir = path.join(process.cwd(), 'uploads');

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Convert the request into a Node.js Readable stream
  const readableReq = requestToReadableStream(req);

  // Initialize formidable
  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(readableReq, async (err: any, fields: any, files: any) => {
      if (err) {
        resolve(NextResponse.json({ message: 'Error parsing files' }, { status: 500 }));
      }

      const fileArray = Array.isArray(files.file) ? files.file : [files.file];

      const results = await Promise.all(
        fileArray.map((file: any) => {
          return new Promise((resolve, reject) => {
            exec(`python3 getScore.py ${file.filepath}`, (error, stdout, stderr) => {
              if (error) {
                reject(stderr);
              } else {
                resolve(stdout);
              }
            });
          });
        })
      );

      resolve(NextResponse.json({ results }, { status: 200 }));
    });
  });
}
