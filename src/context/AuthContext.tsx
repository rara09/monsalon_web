import { useState } from 'react';
import type { User } from '../types/userType';
import { AuthContext } from './AuthContextValue';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token'),
  );
  const [user, setUser] = useState<User | null>(null);

  const loginUser = (token: string, user: User) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login: loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContext };
