import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GroupModel from '@/lib/models/GroupSchema';

// Handler for GET requests
export const GET = async (request: NextRequest, { params }: { params: { groupId: string } }) => {
  await dbConnect();

  const { groupId } = params;

  try {
    const group = await GroupModel.findById(groupId).populate('admin members', '-password');
    if (!group) {
      return NextResponse.json({ message: 'Group not found.' }, { status: 404 });
    }
    return NextResponse.json(group, { status: 200 });
  } catch (error) {
    console.error('Error fetching group:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

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
