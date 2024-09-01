import mongoose from 'mongoose';

export type GroupMember = {
  groupId: string;
  userId: string;
  isAdmin: boolean;
};

const GroupMemberSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const GroupMemberModel = mongoose.models?.GroupMember || mongoose.model('GroupMember', GroupMemberSchema);

export default GroupMemberModel;
