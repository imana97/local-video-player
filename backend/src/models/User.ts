import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  username: string;
  password: string;
}

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;
