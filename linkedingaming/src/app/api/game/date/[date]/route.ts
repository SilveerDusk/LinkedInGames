import connectDB from '@/database/db';
import Game from '@/database/gameSchema';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await connectDB();

    try {
      const bodyText = await new Response(request.url).text();
      const dateFilter: string = bodyText.trim().split('/')[6];
      const games = await Game.find({date: dateFilter});
      console.log('Games:', games);
      return NextResponse.json({ games }, { status: 200 });
    } catch (error) {
      console.error('Failed to get the games', error);
      return NextResponse.json(
        { message: 'Failed to get the games', error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to connect to server', error);
    return NextResponse.json(
      { message: 'Failed to connect to server', error },
      { status: 500 }
    )
  }
}