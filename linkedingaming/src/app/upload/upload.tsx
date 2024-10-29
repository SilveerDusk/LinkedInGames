'use client';
import { useState } from 'react';

// Define a type for the server response
interface UploadResponse {
  results: string[][];
}

export default function Upload() {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string>('');
  const [results, setResults] = useState<string[][]>([[]]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selectedFiles);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (files.length === 0) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    console.log('Files:', formData);

    try {
      const response = await fetch(`/api/upload`, {
        method: 'POST',
        body: formData, // Sends the files as FormData
      });

      if (!response.ok) {
        throw new Error('Failed to upload files');
      }

      const data: UploadResponse = await response.json();
      
      // Ensure state updates are outside of render
      console.log('Data:', data);
      setResults(data.results); 
      console.log('Results:', data.results);
      setMessage('Files uploaded successfully');
    } catch (error: unknown) {
      setMessage("Failed to upload files: " + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" multiple onChange={handleFileChange} />
      <button type="submit">Upload</button>
      {message && <p>{message}</p>}
      <ul>
        {results && results.map((result, index) => (
          <li key={index}>Game: {result[0]} Time/Score: {result[1]}</li>
        ))}
      </ul>
    </form>
  );
}
