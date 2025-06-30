import { User, CreateUserData, UpdateUserData } from "@/models/User";
import { apiService } from "@/services/api";

export class UserViewModel {
  private users: User[] = [];
  private loading = false;
  private error: string | null = null;

  // Getters
  getUsers(): User[] {
    return this.users;
  }

  isLoading(): boolean {
    return this.loading;
  }

  getError(): string | null {
    return this.error;
  }

  // Actions
  async fetchUsers(): Promise<void> {
    try {
      this.loading = true;
      this.error = null;
      const response = await apiService.getUsers();
      this.users = response.users;
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to fetch users";
      throw err;
    } finally {
      this.loading = false;
    }
  }

  async fetchUserById(id: string): Promise<User | null> {
    try {
      this.loading = true;
      this.error = null;
      const response = await apiService.getUserById(id);
      return response.user;
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to fetch user";
      throw err;
    } finally {
      this.loading = false;
    }
  }

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      this.loading = true;
      this.error = null;
      const response = await apiService.createUser(userData);
      this.users.push(response.user);
      return response.user;
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to create user";
      throw err;
    } finally {
      this.loading = false;
    }
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<User | null> {
    try {
      this.loading = true;
      this.error = null;
      const response = await apiService.updateUser(id, userData);

      // Update the user in the local array
      const index = this.users.findIndex((user) => user.id === id);
      if (index !== -1) {
        this.users[index] = response.user;
      }

      return response.user;
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to update user";
      throw err;
    } finally {
      this.loading = false;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      this.loading = true;
      this.error = null;
      await apiService.deleteUser(id);

      // Remove the user from the local array
      this.users = this.users.filter((user) => user.id !== id);
      return true;
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to delete user";
      throw err;
    } finally {
      this.loading = false;
    }
  }

  // Utility methods
  clearError(): void {
    this.error = null;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
