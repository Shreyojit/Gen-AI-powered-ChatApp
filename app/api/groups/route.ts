import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GroupModel from '@/lib/models/GroupSchema';

export const POST = async (request: NextRequest) => {
  await dbConnect();

  try {
    const { name, image, admin, members } = await request.json();

    const newGroup = new GroupModel({ name, image, admin, members });
    await newGroup.save();

    return Response.json(newGroup, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export const GET = async (request: NextRequest) => {
  await dbConnect();

  try {
    const groups = await GroupModel.find().populate('admin members', '-password');
    return Response.json(groups, { status: 200 });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
