import mongoose from 'mongoose'

// models/User.ts
export type User = {
  _id: string;
  name: string;
  email: string;

  image?: string; // Add this line
  isOnline?: boolean; // Add this field
}


const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    image: {
      type: String,
      default: null, // This makes it optional
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.models?.User || mongoose.model('User', UserSchema);

export default UserModel;