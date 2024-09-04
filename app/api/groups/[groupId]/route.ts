import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GroupModel from '@/lib/models/GroupSchema';
import mongoose from 'mongoose';


export async function GET(request: NextRequest, { params }: { params: { groupId: string } }) {
  console.log('Handler triggered');
  console.log('Params:', params);
  await dbConnect();

  const { groupId } = params;
  console.log('Group ID:', groupId);

  try {
    // Validate the groupId format
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return NextResponse.json({ message: 'Invalid group ID' }, { status: 400 });
    }

    // Fetch the group by ID and populate members
    const group = await GroupModel.findById(groupId).populate('members', '-password').exec();

    if (!group) {
      return NextResponse.json({ message: 'Group not found' }, { status: 404 });
    }

    // Return the group details along with members
    return NextResponse.json({
      group: {
        _id: group._id,
        name: group.name,
        image: group.image,
        admin: group.admin,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
      },
      members: group.members,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching group members:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
// Handler for PATCH requests
export const PATCH = async (request: NextRequest, { params }: { params: { groupId: string } }) => {
  await dbConnect();

  const { groupId } = params;
  const { name, image, members } = await request.json();

  try {
    const group = await GroupModel.findByIdAndUpdate(groupId, { name, image, members }, { new: true }).populate(
      'admin members',
      '-password'
    );
    if (!group) {
      return NextResponse.json({ message: 'Group not found.' }, { status: 404 });
    }
    return NextResponse.json(group, { status: 200 });
  } catch (error) {
    console.error('Error updating group:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

// Handler for DELETE requests
export const DELETE = async (request: NextRequest, { params }: { params: { groupId: string } }) => {
  await dbConnect();

  const { groupId } = params;

  try {
    const group = await GroupModel.findByIdAndDelete(groupId);
    if (!group) {
      return NextResponse.json({ message: 'Group not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Group deleted.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
