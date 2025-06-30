import { Request, Response, NextFunction } from 'express';
import { UserViewModel } from '@/viewmodels/UserViewModel';
import { UpdateUserData, CreateStudentData } from '@/models/User';
import { createError } from '@/middleware/errorHandler';

export class UserController {
  private userViewModel: UserViewModel;

  constructor() {
    this.userViewModel = new UserViewModel();
  }

  getAllUsers = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.userViewModel.getAllUsers();
      res.json({ users });
    } catch (error) {
      next(createError('Failed to fetch users', 500));
    }
  };

  getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        next(createError('User ID is required', 400));
        return;
      }

      const user = await this.userViewModel.getUserById(id);

      if (!user) {
        next(createError('User not found', 404));
        return;
      }

      res.json({ user });
    } catch (error) {
      next(createError('Failed to fetch user', 500));
    }
  };

  createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData: CreateStudentData = req.body;

      if (
        !userData.email ||
        !userData.firstName ||
        !userData.lastName ||
        !userData.password
      ) {
        next(
          createError(
            'Email, firstName, lastName, and password are required',
            400
          )
        );
        return;
      }

      if (userData.password.length < 6) {
        next(createError('Password must be at least 6 characters long', 400));
        return;
      }

      const newUser = await this.userViewModel.createUser(userData);
      res.status(201).json({ user: newUser });
    } catch (error) {
      next(createError('Failed to create user', 500));
    }
  };

  updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        next(createError('User ID is required', 400));
        return;
      }

      const userData: UpdateUserData = req.body;

      const updatedUser = await this.userViewModel.updateUser(id, userData);

      if (!updatedUser) {
        next(createError('User not found', 404));
        return;
      }

      res.json({ user: updatedUser });
    } catch (error) {
      next(createError('Failed to update user', 500));
    }
  };

  deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        next(createError('User ID is required', 400));
        return;
      }

      const deleted = await this.userViewModel.deleteUser(id);

      if (!deleted) {
        next(createError('User not found', 404));
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(createError('Failed to delete user', 500));
    }
  };
}
