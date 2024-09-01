

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SingleMessageModel from '@/lib/models/SingleMessageSchema';
import pusher from '@/lib/pusher';


export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { senderId, receiverId, message, type } = await request.json();

    const newMessage = new SingleMessageModel({
      sender: senderId,
      receiver: receiverId,
      message,
      type,
      sentAt: new Date(),
    });
    console.log("New Mesage",newMessage)

    await newMessage.save();

    // Trigger an event
const result = await pusher.trigger(`user-${receiverId}`, 'singleMessage', newMessage);
console.log('Event Triggered:', result);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}





// GET request to fetch messages
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const senderId = searchParams.get('senderId');
    const receiverId = searchParams.get('receiverId');
    const limit = parseInt(searchParams.get('limit') || '100'); // Default to last 10 messages if not provided

    if (!senderId || !receiverId) {
      return NextResponse.json({ message: 'Sender ID and Receiver ID are required.' }, { status: 400 });
    }

    // Calculate the start date for the last 20 days
    const twentyDaysAgo = new Date();
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

    // Query for messages
    const query = {
      sentAt: { $gte: twentyDaysAgo }, // Filter by the last 20 days
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    };

    console.log('Query:', JSON.stringify(query, null, 2));

    const messages = await SingleMessageModel.find(query)
      .sort({ sentAt: -1 })
      .limit(limit);

    console.log('Messages:', messages);

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}

// DELETE request to remove a message
export async function DELETE(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');
    const userId = searchParams.get('userId');

    if (!messageId || !userId) {
      return NextResponse.json({ message: 'Message ID and User ID are required.' }, { status: 400 });
    }

    const message = await SingleMessageModel.findById(messageId);
    if (!message) {
      return NextResponse.json({ message: 'Message not found.' }, { status: 404 });
    }

    if (message.sender.toString() !== userId && message.receiver.toString() !== userId) {
      return NextResponse.json({ message: 'You do not have permission to delete this message.' }, { status: 403 });
    }

    await SingleMessageModel.findByIdAndDelete(messageId);
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
      return NextResponse.json({ message: 'Message ID, User ID, and new message content are required.' }, { status: 400 });
    }

    const message = await SingleMessageModel.findById(messageId);
    if (!message) {
      return NextResponse.json({ message: 'Message not found.' }, { status: 404 });
    }

    if (message.sender.toString() !== userId) {
      return NextResponse.json({ message: 'You can only edit your own messages.' }, { status: 403 });
    }

    message.message = newMessageContent;
    await message.save();

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}
