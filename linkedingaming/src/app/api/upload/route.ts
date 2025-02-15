import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);  // Convert exec to return a Promise

// Handle POST requests
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    console.log('File:', files);

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const results: string[][] = [];
    for (const file of files){
      // Save the file
      const filePath = path.join(process.cwd(), '/uploads', file.name);
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, fileBuffer);

      // Path to Python script
      const pythonScript = path.join(process.cwd(), 'getScore.py');

      // Call the Python script using exec wrapped in a Promise
      const { stdout, stderr } = await execPromise(`python3 ${pythonScript} ${filePath}`);

      if (stderr) {
        console.error('Error running Python script:', stderr);
        return NextResponse.json(
          { message: 'Error processing files' },
          { status: 500 }
        );
      }

      // Extract results using regex from Python script output
      const regex = /\'(.*?)\'/g;
      const match = stdout.match(regex);
      const output = match ? match.map(m => m.slice(1, -1)) : [];

      // Process and return the results
      if (output.length === 0) {
        return NextResponse.json({ message: 'No results found in ' + file.name });
      } else if (output.length % 2 === 1) {
        return NextResponse.json({ message: 'Error in processing files, please upload one at a time' });
      } else {
        for (let i = 0; i < output.length; i += 2) {
          results.push([output[i], output[i + 1]]);
        }
      }
    }
    console.log('Results: ', results);
    return NextResponse.json({message: 'Success in finding score', results: results}, { status: 200 });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { message: 'Error processing files' },
      { status: 500 }
    );
  }
}
