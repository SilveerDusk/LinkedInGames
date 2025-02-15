'use client';
import { useEffect, useState } from 'react';
import { IUser } from '@/database/userSchema';

// Define a type for the server response
interface UploadResponse {
  results: string[][];
  message: string;
}

export default function Upload() {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string>('');
  const [results, setResults] = useState<string[][]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const lol = 'lol';

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || '{}'));
  }, [lol]);

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
      console.log('Results:', data.results, data.message);
      for (const result of data.results) {
        const gameData = {
          type: result[0],
          score: result[1],
          user: user?._id || '',
          name: user?.name || '',
          date: new Date().toISOString().split('T')[0],
        };
        console.log('Game data:', gameData);
        const response = await fetch(`/api/game/${gameData.type}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(gameData),
        });
        if (response.status === 200) {
          const data = await response.json();
          console.log('Game data created:', data.game, data.message);
          setResults([...results, [data.game.type, data.game.score]]);
          console.log('Results:', results);
        } else {
          console.log('Failed to create game data: ', response.status);
        }
      }
    } catch (error: unknown) {
      setMessage('Failed to upload files: ' + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" multiple onChange={handleFileChange} />
      <button type="submit" style={{ backgroundColor: 'blue', color: 'white', padding: '5px 10px', borderRadius: '10px', cursor: "pointer" }}>Scan Image</button>
      {message && <p>{message}</p>}
      <ul style={{ listStyleType: 'none', padding: "10px 5px" }}>
        {results &&
          results.map((result, index) => (
            <li key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <p style={{ margin: "5px" }}>Game: {result[0]}</p>
              <p style={{ margin: "5px" }}>Time/Score: {result[1]}</p>
            </li>
          ))}
      </ul>
    </form>
  );
}
