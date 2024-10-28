'use client';
// pages/upload.js
import { useState } from 'react';

export default function Upload() {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (files.length === 0) {
      setMessage('Please select a file.');
      return;
    }

    console.log('Uploading files...: ', files);

    /*
    try {
      const response = await fetch(`/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload files');
      }

      const data = await response.json();
      setResults(data.results);
      setMessage('Files uploaded successfully');
    } catch (error: any) {
      setMessage(error.message);
    }
    */
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" multiple onChange={handleFileChange} />
      <button type="submit">Upload</button>
      {message && <p>{message}</p>}
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </form>
  );
}