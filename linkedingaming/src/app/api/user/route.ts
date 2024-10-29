import connectDB from '@/database/db';
import User, { IUser } from '@/database/userSchema';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request
) {
  try {
    await connectDB();

    try {
      // convert the readable stream to JSON
      const bodyText = await new Response(request.body).text();
      const body: IUser = JSON.parse(bodyText);
      // create a new user
      const user = new User({
          ...body,
          verified: false,
      });

      if (!user.email || !user.name) {
        return NextResponse.json(
          { error: 'Email and name are required' },
          { status: 400 }
        );
      }

      const existingUser = await User.findOne({ email: user.email });

      // check if user exists
      if (existingUser) {
        if (existingUser.email === user.email) {
          return NextResponse.json({
            message: 'User already exists!',
            user: existingUser,
            status: 201,
          });
        } else {
          return NextResponse.json({
            message: 'Email is already linked to an account',
            user: existingUser,
            status: 501,
          });
        }
      } else {
        const newUser = new User(user);

        await newUser.save();

        return NextResponse.json({
          message: 'New user created',
          user: newUser,
          status: 201,
        });
      }
    } catch (error) {
      return NextResponse.json(
        { message: 'Failed to create the user', error },
        { status: 505 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to connect to the database', error },
      { status: 404 }
    );
  }
}
