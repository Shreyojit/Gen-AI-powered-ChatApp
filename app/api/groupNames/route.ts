import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GroupModel from '@/lib/models/GroupSchema';
import mongoose from 'mongoose';

interface Group {
  _id: string;
  name: string;
  image?: string;
  members: string[];
}

export async function GET(request: NextRequest) {
  console.log('GET function called');

  await dbConnect();
  console.log('Database connected');

  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  console.log('Extracted userId:', userId);

  if (!userId) {
    console.error('User ID is missing in the request');
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  const userIdString = userId.toString().trim();
  console.log('Converted userId to string:', userIdString, 'Type:', typeof userIdString);

  try {
    // Convert userId to ObjectId for querying
    const userIdObjectId = new mongoose.Types.ObjectId(userIdString);

    // Query groups where the user is either admin or a member
    const groups = await GroupModel.find({
      $or: [
        { admin: userIdObjectId }, // Check if user is admin
        { members: userIdObjectId } // Check if user is a member
      ]
    }).select('name _id members image');

    console.log('Groups found:', JSON.stringify(groups, null, 2));

    const groupsWithStringMembers: Group[] = groups.map(group => ({
      _id: group._id.toString(),
      name: group.name,
      image: group.image,
      members: (group.members as mongoose.Types.ObjectId[]).map(id => id.toString())
    }));

    if (groupsWithStringMembers.length === 0) {
      console.log('No groups found for user:', userId);
      return NextResponse.json([]); // No groups found for the user
    }

    return NextResponse.json(groupsWithStringMembers);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
