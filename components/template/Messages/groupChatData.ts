// import { ObjectId } from 'mongodb';
// import { Conversation, Message, User } from './model';

// // Dummy users
// export const dummyUser: User = {
//   _id: new ObjectId('64e44f14f3c3e82bcecfb5e0').toString(),
//   name: 'John Doe',
//   email: 'johndoe@email.com',
//   image: 'https://randomuser.me/api/portraits/men/67.jpg',
//   tokenIdentifier: 'token123',
//   isOnline: true,
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
// };

// export const dummyReceiver: User = {
//   _id: new ObjectId('64e44f14f3c3e82bcecfb5e1').toString(),
//   name: 'Jane Doe',
//   email: 'janedoe@email.com',
//   image: 'https://randomuser.me/api/portraits/women/67.jpg',
//   tokenIdentifier: 'token124',
//   isOnline: true,
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
// };

// export const dummyUser2: User = {
//   _id: new ObjectId('64e44f14f3c3e82bcecfb5e2').toString(),
//   name: 'Alice Smith',
//   email: 'alicesmith@email.com',
//   image: 'https://randomuser.me/api/portraits/women/68.jpg',
//   tokenIdentifier: 'token125',
//   isOnline: false,
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
// };

// export const dummyUser3: User = {
//   _id: new ObjectId('64e44f14f3c3e82bcecfb5e3').toString(),
//   name: 'Bob Johnson',
//   email: 'bobjohnson@email.com',
//   image: 'https://randomuser.me/api/portraits/men/68.jpg',
//   tokenIdentifier: 'token126',
//   isOnline: false,
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
// };

// // Dummy group conversation
// export const dummyGroupConversation: Conversation = {
//   _id: new ObjectId('64e44f14f3c3e82bcecfb5e4').toString(),
//   isGroup: true,
//   groupName: 'Study Group',
//   groupImage: 'https://randomuser.me/api/portraits/men/69.jpg',
//   admin: dummyUser._id,
//   participants: [dummyUser._id, dummyReceiver._id, dummyUser2._id, dummyUser3._id],
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
// };

// // Dummy messages for group chat
// export const dummyGroupMessages: Message[] = [
//   {
//     _id: new ObjectId('64e44f14f3c3e82bcecfb5e5').toString(),
//     conversationId: dummyGroupConversation._id,
//     senderId: dummyUser._id,
//     content: 'Hello everyone!',
//     messageType: 'text',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: new ObjectId('64e44f14f3c3e82bcecfb5e6').toString(),
//     conversationId: dummyGroupConversation._id,
//     senderId: dummyReceiver._id,
//     content: 'Hey there!',
//     messageType: 'text',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: new ObjectId('64e44f14f3c3e82bcecfb5e7').toString(),
//     conversationId: dummyGroupConversation._id,
//     senderId: dummyUser2._id,
//     content: 'Hi everyone, what’s up?',
//     messageType: 'text',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: new ObjectId('64e44f14f3c3e82bcecfb5e8').toString(),
//     conversationId: dummyGroupConversation._id,
//     senderId: dummyUser3._id,
//     content: 'Hello all!',
//     messageType: 'text',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
// ];
