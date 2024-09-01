import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/User';

export const GET = async (request: NextRequest, { params }: { params: { userId: string } }) => {
  await dbConnect();

  const { userId } = params;

  try {
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return Response.json({ message: 'User not found.' }, { status: 404 });
    }
    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export const PATCH = async (request: NextRequest, { params }: { params: { userId: string } }) => {
  await dbConnect();

  const { userId } = params;
  const { name, email, status } = await request.json();

  try {
    const user = await UserModel.findByIdAndUpdate(userId, { name, email, status }, { new: true }).select('-password');
    if (!user) {
      return Response.json({ message: 'User not found.' }, { status: 404 });
    }
    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest, { params }: { params: { userId: string } }) => {
  await dbConnect();

  const { userId } = params;

  try {
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      return Response.json({ message: 'User not found.' }, { status: 404 });
    }
    return Response.json({ message: 'User deleted.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
