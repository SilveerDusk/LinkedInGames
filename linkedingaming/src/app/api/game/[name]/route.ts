import connectDB from '@/database/db';
import Game, { IGame } from '@/database/gameSchema';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await connectDB();

    try {
      const bodyText = await new Response(request.body).text();
      const gameType: string = JSON.parse(bodyText);
      const games = await Game.find({ type: gameType });
      return NextResponse.json({ games }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: 'Failed to get the games', error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to connect to server', error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    try {
      const bodyText = await new Response(request.body).text();
      const body: IGame = JSON.parse(bodyText);

      // create a new user
      const game: IGame = new Game({
        type: body.type,
        score: body.score,
        date: body.date,
        user: body.user,
        name: body.name,
      });

      if (!game.score) {
        return NextResponse.json(
          { error: 'A score is required' },
          { status: 400 }
        );
      } else if (!game.user || !game.name) {
        return NextResponse.json(
          { error: 'Player data is required' },
          { status: 400 }
        );
      } else if (!game.date) {
        return NextResponse.json(
          { error: 'Date is required' },
          { status: 400 }
        );
      }

      const existingGame = await Game.findOne({
        date: game.date,
        type: game.type,
        name: game.name,
      });

      console.log('Existing game: ', existingGame);

      // check if game exists
      if (existingGame) {
        return NextResponse.json({
          message: 'You have already sumbited a game for today!',
          game: existingGame,
          status: 201,
        });
      } else {
        const newGame = new Game(game);

        await newGame.save();

        return NextResponse.json({
          message: 'New game created',
          game: newGame,
          status: 201,
        });
      }
    } catch (error) {
      return NextResponse.json(
        { message: 'Failed to create the game', error },
        { status: 505 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to connect to the database', error },
      { status: 500 }
    );
  }
}
