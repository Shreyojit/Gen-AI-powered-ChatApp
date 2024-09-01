import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SingleMessageModel from '@/lib/models/SingleMessageSchema';
import GroupMessageModel from '@/lib/models/GroupMessageSchema';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  await dbConnect();

  // Extract userId from the query parameters
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

    // Find the last message sent by the user in individual conversations
    const lastSingleMessages = await SingleMessageModel.aggregate([
      {
        $match: {
          $or: [{ sender: userObjectId }, { receiver: userObjectId }]
        }
      },
      {
        $addFields: {
          conversationId: {
            $cond: {
              if: { $gt: [{ $toString: "$sender" }, { $toString: "$receiver" }] },
              then: { $concat: [{ $toString: "$receiver" }, "-", { $toString: "$sender" }] },
              else: { $concat: [{ $toString: "$sender" }, "-", { $toString: "$receiver" }] }
            }
          }
        }
      },
      {
        $sort: { conversationId: 1, sentAt: -1 }
      },
      {
        $group: {
          _id: "$conversationId",
          lastMessageId: { $first: "$_id" },
          sender: { $first: "$sender" },
          receiver: { $first: "$receiver" },
          message: { $first: "$message" },
          sentAt: { $first: "$sentAt" }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'senderDetails'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'receiver',
          foreignField: '_id',
          as: 'receiverDetails'
        }
      },
      {
        $unwind: '$senderDetails'
      },
      {
        $unwind: '$receiverDetails'
      },
      {
        $project: {
          _id: 0,
          conversationId: "$_id",
          senderName: "$senderDetails.name",
          receiverName: "$receiverDetails.name",
          lastMessage: "$message",
          sentAt: "$sentAt"
        }
      }
    ]);

    // Find the last message sent by the user in group chats
    const lastGroupMessages = await GroupMessageModel.aggregate([
      {
        $match: {
          $or: [
            { senderId: userObjectId },
            { groupId: { $in: await GroupMessageModel.distinct("groupId", { members: userObjectId }) } }
          ]
        }
      },
      {
        $sort: { groupId: 1, sentAt: -1 }
      },
      {
        $group: {
          _id: "$groupId",
          lastMessageId: { $first: "$_id" },
          message: { $first: "$message" },
          sentAt: { $first: "$sentAt" }
        }
      },
      {
        $lookup: {
          from: 'groups',
          localField: '_id',
          foreignField: '_id',
          as: 'groupDetails'
        }
      },
      {
        $unwind: '$groupDetails'
      },
      {
        $project: {
          _id: 0,
          groupId: "$_id",
          groupName: "$groupDetails.name",
          lastMessage: "$message",
          sentAt: "$sentAt"
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        lastSingleMessages,
        lastGroupMessages,
      },
    });
  } catch (error) {
    console.error('Error fetching last messages:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch last messages' },
      { status: 500 }
    );
  }
}


