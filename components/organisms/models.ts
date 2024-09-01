// models.ts

// User model
export class User {
    id?: string;
    name?: string;
    email: string;
    image: string;
    tokenIdentifier: string;
    isOnline: boolean;
  
    constructor(
      email: string,
      image: string,
      tokenIdentifier: string,
      isOnline: boolean,
      id?: string,
      name?: string
    ) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.image = image;
      this.tokenIdentifier = tokenIdentifier;
      this.isOnline = isOnline;
    }
  }
  
  // Conversation model
  export class Conversation {
    id?: string;
    participants: string[]; // Array of User IDs
    isGroup: boolean;
    groupName?: string;
    groupImage?: string;
    admin?: string; // Admin User ID
  
    constructor(
      participants: string[],
      isGroup: boolean,
      id?: string,
      groupName?: string,
      groupImage?: string,
      admin?: string
    ) {
      this.id = id;
      this.participants = participants;
      this.isGroup = isGroup;
      this.groupName = groupName;
      this.groupImage = groupImage;
      this.admin = admin;
    }
  }
  
  // Message model
  export class Message {
    id?: string;
    conversation: string; // Conversation ID
    sender: string; // Sender's name (can be a string for compatibility)
    content: string;
    messageType: "text" | "image" | "video";
  
    constructor(
      conversation: string,
      sender: string,
      content: string,
      messageType: "text" | "image" | "video",
      id?: string
    ) {
      this.id = id;
      this.conversation = conversation;
      this.sender = sender;
      this.content = content;
      this.messageType = messageType;
    }
  }
  