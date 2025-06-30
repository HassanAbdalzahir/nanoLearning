import { User, IUser, CreateStudentData, UpdateUserData } from '../models/User';
import { logger } from '../utils/logger';

export class UserViewModel {
  async getAllUsers(): Promise<IUser[]> {
    try {
      logger.info('Fetching all users');
      return await User.find().select('-password');
    } catch (error) {
      logger.error('Error fetching users', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      logger.info(`Fetching user with id: ${id}`);
      return await User.findById(id).select('-password');
    } catch (error) {
      logger.error(`Error fetching user with id: ${id}`, error);
      throw error;
    }
  }

  async createUser(userData: CreateStudentData): Promise<IUser> {
    try {
      logger.info('Creating new user', userData);

      const newUser = new User({
        ...userData,
        role: 'student',
      });
      await newUser.save();
      return newUser;
    } catch (error) {
      logger.error('Error creating user', error);
      throw error;
    }
  }

  async updateUser(
    id: string,
    userData: UpdateUserData
  ): Promise<IUser | null> {
    try {
      logger.info(`Updating user with id: ${id}`, userData);

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { ...userData },
        { new: true, runValidators: true }
      ).select('-password');

      return updatedUser;
    } catch (error) {
      logger.error(`Error updating user with id: ${id}`, error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      logger.info(`Deleting user with id: ${id}`);

      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error(`Error deleting user with id: ${id}`, error);
      throw error;
    }
  }
}
