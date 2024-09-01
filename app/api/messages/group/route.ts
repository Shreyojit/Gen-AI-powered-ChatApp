import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GroupModel from '@/lib/models/GroupSchema';
import GroupMessageModel from '@/lib/models/GroupMessageSchema';
import pusher from '@/lib/pusher'; // Import the common Pusher instance
import mongoose from 'mongoose';



export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { groupId, senderId, message, type } = await request.json();

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return NextResponse.json({ message: 'Group not found.' }, { status: 404 });
    }

    if (!group.members.includes(senderId)) {
      return NextResponse.json({ message: 'Sender is not a member of the group.' }, { status: 403 });
    }

    const newMessage = new GroupMessageModel({
      groupId,
      senderId,
      message,
      type,
      sentAt: new Date(),
    });

    await newMessage.save();

     // Trigger the event to the group channel
     const groupResult = await pusher.trigger(`group-${groupId}`, 'groupMessage', newMessage);
     console.log('Group Event Triggered:', groupResult);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}

// DELETE request to remove a message
export async function DELETE(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    console.log(searchParams)
    const messageId = searchParams.get('messageId');
    const userId = searchParams.get('userId');

    if (!messageId || !userId) {
      return NextResponse.json({ message: 'Message ID and User ID are required.' }, { status: 400 });
    }

    // Find the message to be deleted
    const message = await GroupMessageModel.findById(messageId);
    if (!message) {
      return NextResponse.json({ message: 'Message not found.' }, { status: 404 });
    }

    // Find the group associated with the message
    const group = await GroupModel.findById(message.groupId);
    if (!group) {
      return NextResponse.json({ message: 'Group not found.' }, { status: 404 });
    }

    // Check if the user is a member of the group
    if (!group.members || !group.members.includes(userId)) {
      return NextResponse.json({ message: 'User is not a member of the group.' }, { status: 403 });
    }

    // Check if the user is the sender of the message
    if (message.senderId !== userId) {
      return NextResponse.json({ message: 'You can only delete your own messages.' }, { status: 403 });
    }

    // Delete the message
    await GroupMessageModel.findByIdAndDelete(messageId);

    return NextResponse.json({ message: 'Message deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}

// PUT request to update a message
export async function PUT(request: NextRequest) {
  await dbConnect();

  try {
    const { messageId, userId, newMessageContent } = await request.json();

    if (!messageId || !userId || !newMessageContent) {
      return NextResponse.json({ message: 'Message ID, User ID, and new content are required.' }, { status: 400 });
    }

    const message = await GroupMessageModel.findById(messageId);

    if (!message) {
      return NextResponse.json({ message: 'Message not found.' }, { status: 404 });
    }

    const group = await GroupModel.findById(message.groupId);
    if (!group) {
      return NextResponse.json({ message: 'Group not found.' }, { status: 404 });
    }

    if (message.senderId.toString() !== userId && !group.admins.includes(userId)) {
      return NextResponse.json({ message: 'You are not authorized to edit this message.' }, { status: 403 });
    }

    message.message = newMessageContent;
    await message.save();

    return NextResponse.json({ message: 'Message updated successfully.', updatedMessage: message }, { status: 200 });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}

// export async function GET(request: NextRequest) {
//   await dbConnect();

//   try {
//     const { searchParams } = new URL(request.url);
//     const groupId = searchParams.get('groupId');

//     if (!groupId) {
//       return NextResponse.json({ message: 'Group ID is required.' }, { status: 400 });
//     }

//     // Trim any extra whitespace or newline characters
//     const trimmedGroupId = groupId.trim();

//     // Check if the groupId is a valid ObjectId string
//     if (!mongoose.isValidObjectId(trimmedGroupId)) {
//       return NextResponse.json({ message: 'Invalid Group ID format.' }, { status: 400 });
//     }

//     // Convert the groupId to an ObjectId
//     const objectId = new mongoose.Types.ObjectId(trimmedGroupId);

//     // Fetch messages for the specified groupId
//     const messages = await GroupMessageModel.find({ groupId: objectId })
//       .sort({ sentAt: -1 })
//       .exec();

//     return NextResponse.json(messages, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
//   }
// }

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');

    if (!groupId) {
      return NextResponse.json({ message: 'Group ID is required.' }, { status: 400 });
    }

    // Trim any extra whitespace or newline characters
    const trimmedGroupId = groupId.trim();

    // Check if the groupId is a valid ObjectId string
    if (!mongoose.isValidObjectId(trimmedGroupId)) {
      return NextResponse.json({ message: 'Invalid Group ID format.' }, { status: 400 });
    }

    // Convert the groupId to an ObjectId
    const objectId = new mongoose.Types.ObjectId(trimmedGroupId);

    // Fetch messages for the specified groupId and populate senderId with user details
    const messages = await GroupMessageModel.find({ groupId: objectId })
      .sort({ sentAt: -1 })
      .populate('senderId', 'name') // Populate senderId with name
      .exec();

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}