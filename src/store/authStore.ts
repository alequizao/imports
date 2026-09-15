/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

"use client";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface AuthState {
  currentUser: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isInitialized: boolean; // To track if rehydration is complete
  login: (email: string, passwordAttempt: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, passwordAttempt: string) => Promise<boolean>;
  users: User[]; // Keep track of registered users for this mock
  initializeUsers: () => void; // To load users from localStorage if they exist
}

// IMPORTANT: This is a MOCK authentication store for UI development.
// DO NOT use this for production. Passwords should be hashed and verified on a backend.
const initialMockUsers: User[] = [
    { id: 'user-123', email: 'user@example.com', name: 'Usuário Exemplo', passwordHash: 'hashedpassword123' },
];


export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      currentUser: null,
      isLoggedIn: false,
      isLoading: false,
      isInitialized: false,
      users: initialMockUsers, // Start with initial mock users

      initializeUsers: () => {
        // This function is called by onRehydrateStorage to ensure users are loaded
        // No explicit action needed here if 'users' is part of persisted state
        // and correctly merged.
      },

      login: async (email, passwordAttempt) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call

        const user = get().users.find(u => u.email === email);
        // For this mock, we're not actually checking the password. A real app MUST.
        if (user /* && await bcrypt.compare(passwordAttempt, user.passwordHash) */) {
          set({ currentUser: {id: user.id, email: user.email, name: user.name }, isLoggedIn: true, isLoading: false });
          return true;
        } else {
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ currentUser: null, isLoggedIn: false, isLoading: false });
      },

      register: async (name, email, passwordAttempt) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 700));

        if (get().users.some(u => u.email === email)) {
          set({ isLoading: false });
          return false; // Email already exists
        }
        
        const newUser: User = { 
          id: uuidv4(), 
          email, 
          name, 
          passwordHash: `hashed-${passwordAttempt}` // Mock hashing
        };
        
        set(state => ({ 
          users: [...state.users, newUser],
          currentUser: {id: newUser.id, email: newUser.email, name: newUser.name}, 
          isLoggedIn: true, 
          isLoading: false 
        }));
        return true;
      },
    }),
    {
      name: 'vsimports-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ // Only persist these fields
        currentUser: state.currentUser,
        isLoggedIn: state.isLoggedIn,
        users: state.users, // Persist the users list
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true;
          state.initializeUsers(); // Ensure users are loaded
        }
      },
      // Merge state from localStorage with initial state
      merge: (persistedState, currentState) => {
        const mergedUsers = (persistedState as AuthState)?.users?.length 
          ? (persistedState as AuthState).users 
          : initialMockUsers;
        
        return {
          ...currentState,
          ...(persistedState as object), // Type assertion
          users: mergedUsers,
          isInitialized: true,
        };
      },
    }
  )
);

// Initialize store on client load
if (typeof window !== 'undefined') {
  useAuthStore.getState().isInitialized; // Access isInitialized to trigger rehydration
}
