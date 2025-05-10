
"use client";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/lib/types'; // Assuming User type is defined
import { useToast } from '@/hooks/use-toast'; // For user feedback

interface AuthState {
  currentUser: User | null;
  isLoggedIn: boolean;
  isLoading: boolean; // To manage loading state during auth operations
  login: (email: string, passwordAttempt: string) => Promise<boolean>; // Simulate async
  logout: () => void;
  register: (name: string, email: string, passwordAttempt: string) => Promise<boolean>; // Simulate async
  isInitialized: boolean;
}

// IMPORTANT: This is a MOCK authentication store for UI development.
// DO NOT use this for production. Passwords should be hashed and verified on a backend.
const MOCK_USERS: User[] = [
    { id: 'user-123', email: 'user@example.com', name: 'Usuário Exemplo', passwordHash: 'hashedpassword123' }, // Store HASHED passwords
];


export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      currentUser: null,
      isLoggedIn: false,
      isLoading: false,
      isInitialized: false,

      login: async (email, passwordAttempt) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, you'd send email/password to a backend for verification.
        // The backend would check against a database of hashed passwords.
        const user = MOCK_USERS.find(u => u.email === email);
        // For this mock, we're not actually checking the password. A real app MUST.
        if (user /* && await bcrypt.compare(passwordAttempt, user.passwordHash) */) {
          set({ currentUser: {id: user.id, email: user.email, name: user.name }, isLoggedIn: true, isLoading: false });
          // toast({ title: 'Login Bem-sucedido!', description: `Bem-vindo de volta, ${user.name || user.email}!`});
          return true;
        } else {
          set({ isLoading: false });
          // toast({ title: 'Erro de Login', description: 'E-mail ou senha inválidos.', variant: 'destructive' });
          return false;
        }
      },

      logout: () => {
        set({ currentUser: null, isLoggedIn: false, isLoading: false });
        // toast({ title: 'Logout Efetuado', description: 'Você saiu da sua conta.' });
      },

      register: async (name, email, passwordAttempt) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (MOCK_USERS.some(u => u.email === email)) {
          set({ isLoading: false });
          // toast({ title: 'Erro de Registro', description: 'Este e-mail já está em uso.', variant: 'destructive' });
          return false;
        }
        // In a real app, hash the password before storing: const passwordHash = await bcrypt.hash(passwordAttempt, 10);
        const newUser: User = { id: `user-${Date.now()}`, email, name, passwordHash: `hashed-${passwordAttempt}` };
        MOCK_USERS.push(newUser); // Add to mock users list
        set({ currentUser: {id: newUser.id, email: newUser.email, name: newUser.name}, isLoggedIn: true, isLoading: false });
        // toast({ title: 'Registro Concluído!', description: `Bem-vindo, ${name}!` });
        return true;
      },
    }),
    {
      name: 'vsimports-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ // Only persist these fields
        currentUser: state.currentUser,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
            state.isInitialized = true;
        }
      }
    }
  )
);

// Trigger rehydration
if (typeof window !== 'undefined') {
  useAuthStore.getState();
}
