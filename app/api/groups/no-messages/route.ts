import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GroupModel from '@/lib/models/GroupSchema';

export async function findGroupsWithNoMessages() {
  return await GroupModel.aggregate([
    {
      $lookup: {
        from: 'groupmessages', // The name of the GroupMessage collection
        localField: '_id',
        foreignField: 'groupId',
        as: 'messages',
      },
    },
    {
      $match: {
        messages: { $size: 0 },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
      },
    },
  ]);
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect(); // Connect to the database
    console.log('Database connected');

    const groupsWithNoMessages = await findGroupsWithNoMessages();
    console.log('Groups with no messages found:', JSON.stringify(groupsWithNoMessages, null, 2));

    return NextResponse.json(groupsWithNoMessages, { status: 200 });
  } catch (error) {
    console.error('Error fetching groups with no messages:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
