import mongoose, { Schema } from 'mongoose';

export type IUser = {
  name: string;
  email: string;
  verified: boolean;
};

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  verified: { type: Boolean, required: true },
});

const User =
  mongoose.models['userTest'] || mongoose.model('userTest', UserSchema);

export default User;
