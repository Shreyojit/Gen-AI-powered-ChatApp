// dummyData.ts

import { Conversation, Message, User } from "./models";


export const dummyUsers: User[] = [
    new User("john@example.com", "/path/to/avatar1.png", "token1", true, "1", "John Doe"),
    new User("jane@example.com", "/path/to/avatar2.png", "token2", true, "2", "Jane Smith"),
    // Add more users as needed
];

export const dummyConversations: Conversation[] = [
    new Conversation(["1", "2"], true, "1", "Group Chat 1", "/path/to/group1.png", "1"),
    new Conversation(["1"], false, "2"),
    // Add more conversations as needed
];

export const dummyMessages: Message[] = [
    new Message("1", "John Doe", "This is a last message of a group chat.", "text", "1"),
    new Message("2", "Jane Smith", "This is the last message in a private chat.", "text", "2"),
    // Add more messages as needed
];
