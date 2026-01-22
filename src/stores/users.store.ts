import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type { CreateUser, User } from '../static/types';

interface UsersState {
  users: User[];
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: [],
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    allUsers: (state) => state.users,
    usersCount: (state) => state.users.length,

    getUserById: (state) => (id: number) => {
      return state.users.find((user) => user.id === id);
    },
  },

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get('/users');
        this.users = response.data.users || response.data;
        return this.users;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUser(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`/users/${id}`);
        this.user = response.data;
        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData: CreateUser) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post('/users', userData);
        this.users.push(response.data);

        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id: number, userData: Partial<User>) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.put(`/users/${id}`, userData);
        const index = this.users.findIndex((u) => u.id === id);
        if (index !== -1) {
          this.users[index] = response.data;
        }

        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id: number) {
      this.loading = true;
      this.error = null;

      try {
        await api.delete(`/users/${id}`);
        this.users = this.users.filter((u) => u.id !== id);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async searchUsers(query: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`/users/search?q=${query}`);
        this.users = response.data.users;
        return response.data.users;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearUsers() {
      this.users = [];
      this.user = null;
      this.error = null;
    },
  },
});
