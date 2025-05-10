"use client";
import {create} from 'zustand';

interface AdminAuthState {
  isAdminLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const ADMIN_USERNAME = 'admin'; // Username is fixed as 'admin'
const ADMIN_PASSWORD = 'admin1010'; // Hardcoded password as per request

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  isAdminLoggedIn: false,
  login: (password) => {
    // In a real app, also check username if it's not fixed
    if (password === ADMIN_PASSWORD) {
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
  // Initialize state from localStorage if available
  // This part needs to be handled carefully to avoid SSR/hydration issues.
  // A common pattern is to set it in a useEffect in a top-level client component.
  // For simplicity here, we'll initialize and let AdminProtectedLayout handle re-check.
  // Alternatively, could load it here if running only on client.
  // A more robust way to initialize from localStorage:
  // isAdminLoggedIn: typeof window !== 'undefined' ? localStorage.getItem('isAdminLoggedIn') === 'true' : false,
}));

// Check localStorage on initial load (client-side only)
if (typeof window !== 'undefined') {
  const storedIsAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  if (storedIsAdminLoggedIn) {
    useAdminAuthStore.setState({ isAdminLoggedIn: true });
  }
}
