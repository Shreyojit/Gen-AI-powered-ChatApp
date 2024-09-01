import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/User';

export const GET = async (request: NextRequest) => {
  await dbConnect();

  try {
    console.log("Hitting get user-contacts API");

    // Extract the userId to exclude from the query parameters
    const url = new URL(request.url);
    const excludeUserId = url.searchParams.get('excludeUserId');

    // Construct the query to exclude the specific user
    const query = excludeUserId ? { _id: { $ne: excludeUserId } } : {};

    // Fetch users excluding password and including only _id, name, and image
    const users = await UserModel.find(query)
      .select('_id name image')
      .exec();

    return NextResponse.json(users, {
      status: 200,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
};
