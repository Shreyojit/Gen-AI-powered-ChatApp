import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GroupModel from '@/lib/models/GroupSchema';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { groupId, userId } = await request.json();

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return NextResponse.json({ message: 'Group not found.' }, { status: 404 });
    }

    if (group.members.includes(userId)) {
      return NextResponse.json({ message: 'User is already a member of this group.' }, { status: 400 });
    }

    group.members.push(userId);
    await group.save();

    return NextResponse.json({ message: 'Member added to group.', group }, { status: 200 });
  } catch (error) {
    console.error('Error adding member to group:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
