import { createContext, useContext } from "react";

export type User = {
  id: number;
  email: string;
  username: string;
};

type AuthContextType = {
  user: User | null | undefined;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  registerWithCode: (
    email: string,
    password: string,
    username: string,
    invitationid: string
  ) => Promise<void>;
  updatePassword: (token: string, newPassword: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean | undefined;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
