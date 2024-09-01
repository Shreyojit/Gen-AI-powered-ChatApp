import mongoose from 'mongoose';

export type GroupMessage = {
  groupId: string;
  senderId: string; // User ID
  message?: string;
  mediaUrl?: string; // URL of the media file
  mediaType?: 'photo' | 'video';
  cloudinaryId?: string; // Optional: Store the Cloudinary public ID for easier management
  sentAt: Date;
};

const GroupMessageSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
    
    },
    mediaUrl: {
      type: String,
      
    },
    mediaType: {
      type: String,
      enum: ['photo', 'video'],
    },
    cloudinaryId: {
      type: String,
    },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const GroupMessageModel = mongoose.models?.GroupMessage || mongoose.model('GroupMessage', GroupMessageSchema);

export default GroupMessageModel;
