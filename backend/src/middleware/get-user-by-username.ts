import UserModel from '../models/User';

// get user by username from the database
export const getUserByUsername = async (username: string) => {
  return UserModel.findOne({username});
} 