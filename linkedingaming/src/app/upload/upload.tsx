'use client';
import { useState } from 'react';
import { IUser } from '@/database/userSchema';

// Define a type for the server response
interface UploadResponse {
  results: string[][];
}

export default function Upload() {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string>('');
  const [results, setResults] = useState<string[][]>([]);
  const user: IUser = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('User:', user);

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
      setResults(data.results); 
      setMessage('Files uploaded successfully');
      results.forEach(result => async () => {
        const gameData = {
          game: result[0],
          score: result[1],
          user: user?._id || '',
          name: user?.name || '',
          day: new Date().toISOString().slice(0, 10)
        }
        const response = await fetch(`/api/game/${result[0]}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(gameData),
        });
        if (response.status === 201) {
          const data = await response.json();
          console.log('Game data created:' data.game);
        } else {
          console.log('Failed to create game data: ', response.status);
        }
      });
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
