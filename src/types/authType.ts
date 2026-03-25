import type { User } from './userType';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // confirmPassword: string;
}

/** @deprecated Utiliser `AuthContextType` dans `context/AuthContextValue.tsx` */
export interface LegacyAuthContextType {
  user: User;
  loading: boolean;
  login: (loginData: LoginData) => Promise<void>;
  logout: () => void;
}

export interface SubmitHandler {
  (e: React.FormEvent<HTMLFormElement>): void;
}
