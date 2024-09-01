// import { ObjectId } from 'mongodb';
// import { Conversation, Message, User } from './model';


// // Dummy users
// export const dummyUser: User = {
//   _id: new ObjectId('66cf6e8ced78a4952dfd79c5').toString(),
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



// // Dummy messages
// export const dummyMessages: Message[] = [
//   {
//     _id: new ObjectId('64e44f14f3c3e82bcecfb5e3').toString(),
//     conversationId: dummyConversation._id,
//     senderId: dummyUser._id,
//     content: 'Hello everyone!',
//     messageType: 'text',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: new ObjectId('64e44f14f3c3e82bcecfb5e4').toString(),
//     conversationId: dummyConversation._id,
//     senderId: dummyReceiver._id,
//     content: 'Hey there!',
//     messageType: 'text',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: new ObjectId('64e44f14f3c3e82bcecfb5e5').toString(),
//     conversationId: dummyConversation._id,
//     senderId: dummyUser._id,
//     content: 'How\'s it going!?',
//     messageType: 'text',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: new ObjectId('64e44f14f3c3e82bcecfb5e6').toString(),
//     conversationId: dummyConversation._id,
//     senderId: dummyReceiver._id,
//     content: 'Fine, thanks!',
//     messageType: 'text',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
// ];
