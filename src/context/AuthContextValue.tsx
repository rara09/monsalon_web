import { createContext } from 'react';
import type { User } from '../types/userType';

export interface AuthContextType {
  user: User | null;
  /** true tant que /auth/me n’a pas répondu (évite flash login / app) */
  loading: boolean;
  /** Après login/register : cookie déjà posé par le backend, on met à jour l’utilisateur en mémoire */
  login: (user: User) => void;
  /** Appelle POST /auth/logout puis vide l’utilisateur local */
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
