'use client';
import React, { useEffect, useState } from "react";
import { IGame } from "@/database/gameSchema";


export default function Leaderboard() {
  const games = ["Tango", "Queens", "Pinpoint", "Crossclimb"]
  const [selectedGame, setSelectedGame] = useState<string>("Tango");
  const [selectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [todaysGames, setTodaysGames] = useState<IGame[]>([]);

  const changeGame = (game: string) => () => {
    setSelectedGame(game);
  }

  const getTodaysGames = async () => {
    const response = await fetch(`http://localhost:3000/api/game/date/${selectedDate}`, {
        method: 'GET',
      }
    )
    if (!response.ok) {
      const data = await response.json();
      console.error(data.message);
      return []
    } else {
      const data = await response.json();
      console.log('Games:', data.games);
      return data.games;
    }
  }

  useEffect(() => {
    const games = getTodaysGames();
    games.then((games) => {
      setTodaysGames(games);
    });
  }, [selectedDate]);
  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {games.map((game) => (
          <button key={game} onClick={changeGame(game)} style={{ margin: "5px", marginLeft: "20px", marginRight: "20px" }}>{game}</button>
        ))}
      </div>
      <h1>{selectedDate} Leaderboard for {selectedGame}</h1>
      {todaysGames.filter(
        (game) => game.type === selectedGame
      ).sort(
        (a, b) => parseInt(a.score) - parseInt(b.score)
      ).map((game) => (
        <div key={game._id}>
          <p>{game.name} - {game.type} - {game.score}</p>
        </div>
      ))}
    </div>
  );
}