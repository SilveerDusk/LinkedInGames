import connectDB from '@/database/db';
import User, { IUser } from '@/database/userSchema';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request
) {
  try {
    await connectDB();

    try {
      // convert the readable stream to JSON
      const bodyText = await new Response(request.body).text();
      const body: { email: string } = JSON.parse(bodyText);
      // update the user
      const user = await User.findOneAndUpdate(
        { email: body.email },
        { verified: true },
      );

      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      console.log('User updated: ', user);
      return NextResponse.json({
        message: 'User updated',
        user,
        status: 200,
      });
    } catch (error) {
      return NextResponse.json(
        { message: 'Failed to update the user', error },
        { status: 505 }
      );
    }
  }
  catch (error) {
    return NextResponse.json(
      { message: 'Failed to connect to the database', error },
      { status: 505 }
    );
  }
}