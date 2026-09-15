/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */
"use client";
import {create} from 'zustand';

interface AdminAuthState {
  isAdminLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

// IMPORTANT: Storing and checking passwords on the client-side is not secure for production applications.
// This an improvement over hardcoding directly in the source, but a proper backend authentication is recommended.
// The password will be exposed in the client-side bundle.
const ADMIN_PASSWORD_FROM_ENV = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin1010'; // Fallback for when ENV is not set

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  isAdminLoggedIn: false,
  login: (password) => {
    if (password === ADMIN_PASSWORD_FROM_ENV) {
      set({ isAdminLoggedIn: true });
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAdminLoggedIn', 'true');
      }
      return true;
    }
    set({ isAdminLoggedIn: false });
     if (typeof window !== 'undefined') {
        localStorage.removeItem('isAdminLoggedIn');
      }
    return false;
  },
  logout: () => {
    set({ isAdminLoggedIn: false });
    if (typeof window !== 'undefined') {
        localStorage.removeItem('isAdminLoggedIn');
      }
  },
}));

// Check localStorage on initial load (client-side only)
if (typeof window !== 'undefined') {
  const storedIsAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  if (storedIsAdminLoggedIn) {
    useAdminAuthStore.setState({ isAdminLoggedIn: true });
  }
}
