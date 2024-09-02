import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GroupModel from '@/lib/models/GroupSchema';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  await dbConnect();

  // Extract userId from query parameters
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { success: false, message: 'Missing userId parameter' },
      { status: 400 }
    );
  }

  try {
    // Convert userId to mongoose ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    console.log('User ObjectId:', userObjectId);

    // Find all groups where the user is a member
    const groups = await GroupModel.find({
      members: userObjectId,
    }).select('name _id'); // Select only the name and _id fields

    console.log('Groups found:', groups);

    // Check if any groups were found
    if (groups.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No groups found for this user',
      });
    }

    // Extract and format group names
    const groupNames = groups.map(group => ({
      groupId: group._id.toString(), // Convert ObjectId to string
      groupName: group.name
    }));

    // Return the result as JSON
    return NextResponse.json({ success: true, data: groupNames });
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user groups' },
      { status: 500 }
    );
  }
}
