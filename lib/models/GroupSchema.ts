import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  image?: string;
  admin: mongoose.Types.ObjectId; // Use ObjectId for admin
  members: mongoose.Types.ObjectId[]; // Use ObjectId for members
}

const GroupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

const GroupModel = mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);

export default GroupModel;
