import { api } from './api';
import type { User, UserCreateRequest } from '../interfaces/user.interface';

export const userService = {

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users/');
    return response.data;
  },

  createUser: async (userData: UserCreateRequest): Promise<User> => {
    const response = await api.post<User>('/users/', userData);
    return response.data;
  },

  deleteUserLogical: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  }
};