import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/User';

export const GET = async (request: NextRequest) => {
  await dbConnect();

  try {
    console.log("Hitting get users API");
    const users = await UserModel.find().select('-password');
    return Response.json(users, {
      status: 200,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return Response.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
};
