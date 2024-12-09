import { create } from 'zustand';
import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/lib/constants';

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (_email: string, _password: string) => {
    set({ isLoading: true });
    try {
      // const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      //   email,
      //   password,
      // });
      // set({ user: response.data, isAuthenticated: true });

      // TODO: change this to real API endpoint
      const response = await fetch("https://randomuser.me/api");
      const data = await response.json();

      // TODO: Update the user object with the real data
      set ({
          user: {
            id: data.results[0].login.uuid || "",
            username: data.results[0].login.username || "",
            first_name: data.results[0].name.first || "",
            last_name: data.results[0].name.last || "",
            email: data.results[0].email || "",
            avatar: data.results[0].picture.thumbnail || "",
          },
          isAuthenticated: true
      });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  getProfile: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
      set({ user: response.data as User, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },
}));