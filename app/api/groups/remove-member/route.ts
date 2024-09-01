import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GroupModel from '@/lib/models/GroupSchema';

export async function DELETE(request: NextRequest) {
  await dbConnect();

  try {
    const { groupId, userId } = await request.json();

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return NextResponse.json({ message: 'Group not found.' }, { status: 404 });
    }

    const userIndex = group.members.indexOf(userId);
    if (userIndex === -1) {
      return NextResponse.json({ message: 'User is not a member of this group.' }, { status: 400 });
    }

    group.members.splice(userIndex, 1);
    await group.save();

    return NextResponse.json({ message: 'Member removed from group.', group }, { status: 200 });
  } catch (error) {
    console.error('Error removing member from group:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
