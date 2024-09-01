import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import dbConnect from '../dbConnect';
import GroupMessageModel from '../models/GroupMessageSchema';
import SingleMessageModel from '../models/SingleMessageSchema';


const setupSocketServer = (httpServer: http.Server) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    // Listen for new messages and save them to the database
    socket.on('sendGroupMessage', async (data) => {
      await dbConnect();

      try {
        const { groupId, senderId, message, type } = data;

        const newMessage = new GroupMessageModel({
          groupId,
          senderId,
          message,
          type,
          sentAt: new Date(),
        });

        await newMessage.save();
        io.to(groupId).emit('groupMessage', newMessage); // Emit to the group
      } catch (error) {
        console.error('Error sending group message:', error);
      }
    });

    socket.on('sendSingleMessage', async (data) => {
      await dbConnect();

      try {
        const { senderId, receiverId, message, type } = data;

        const newMessage = new SingleMessageModel({
          sender: senderId,
          receiver: receiverId,
          message,
          type,
          sentAt: new Date(),
        });

        await newMessage.save();
        socket.emit('singleMessage', newMessage); // Emit to the sender
        socket.to(receiverId).emit('singleMessage', newMessage); // Emit to the receiver
      } catch (error) {
        console.error('Error sending single message:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
    });
  });

  return io;
};

export default setupSocketServer;
