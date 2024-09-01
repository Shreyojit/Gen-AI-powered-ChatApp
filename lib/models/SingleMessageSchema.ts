import mongoose from 'mongoose';

export type SingleMessage = {
  sender: string; // User ID
  receiver: string; // User ID
  message?: string;
  mediaUrl?: string; // URL of the media file
  mediaType?: 'photo' | 'video';
  cloudinaryId?: string; // Optional: Store the Cloudinary public ID for easier management
  sentAt: Date;
  receivedAt?: Date;
  readAt?: Date;
};

const SingleMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
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
    receivedAt: Date,
    readAt: Date,
  },
  { timestamps: true }
);

const SingleMessageModel = mongoose.models?.SingleMessage || mongoose.model('SingleMessage', SingleMessageSchema);

export default SingleMessageModel;
