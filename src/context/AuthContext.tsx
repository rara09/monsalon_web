import { useEffect, useState } from 'react';
import type { User } from '../types/userType';
import { AuthContext } from './AuthContextValue';
import { logout as logoutApi, me } from '../services/authService';
import { userFromAuthResponse } from '../utils/authResponse';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  /** Ancienne auth JWT en localStorage : on nettoie pour éviter confusion */
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  /** Hydratation session via cookie HTTP-only */
  useEffect(() => {
    me()
      .then((data) => {
        try {
          setUser(userFromAuthResponse(data));
        } catch {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const loginUser = (nextUser: User) => {
    setUser(nextUser);
  };

  const logoutUser = async () => {
    try {
      await logoutApi();
    } catch {
      // On déconnecte quand même côté UI (cookie peut déjà être expiré)
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login: loginUser, logout: logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContext };
