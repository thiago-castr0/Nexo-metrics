import { useState, useEffect } from 'react';

export interface User {
  username: string;
  role: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // get from cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const authCookie = getCookie('auth_user');
    if (authCookie) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(authCookie));
        setUser(decodedUser);
      } catch (e) {
        console.error('Error parsing auth cookie', e);
      }
    }
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return { user, logout };
}
