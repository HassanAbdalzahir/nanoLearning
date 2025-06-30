"use client";

import { useState, useEffect, useCallback } from "react";
import { UserViewModel } from "@/viewmodels/UserViewModel";
import { CreateUserData } from "@/models/User";

export default function UserList() {
  const [userViewModel] = useState(() => new UserViewModel());
  const [users, setUsers] = useState(userViewModel.getUsers());
  const [loading, setLoading] = useState(userViewModel.isLoading());
  const [error, setError] = useState(userViewModel.getError());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
  });

  // Sync state with ViewModel
  const updateState = useCallback(() => {
    setUsers([...userViewModel.getUsers()]);
    setLoading(userViewModel.isLoading());
    setError(userViewModel.getError());
  }, [userViewModel]);

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        await userViewModel.fetchUsers();
        updateState();
      } catch {
        updateState();
      }
    };

    loadUsers();
  }, [userViewModel, updateState]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userViewModel.createUser(formData);
      updateState();
      setFormData({ name: "", email: "" });
      setShowCreateForm(false);
    } catch {
      updateState();
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await userViewModel.deleteUser(id);
      updateState();
    } catch {
      updateState();
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showCreateForm ? "Cancel" : "Add User"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showCreateForm && (
        <form
          onSubmit={handleCreateUser}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Enter name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.name}
                </h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No users found. Create your first user!
          </p>
        </div>
      )}
    </div>
  );
}
