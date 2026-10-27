// fe/src/contexts/AuthContext.tsx
import { useState, useEffect, type ReactNode } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  registerWithCode as apiRegisterWithCode,
  getCurrentUser,
  updatePassword as apiUpdatePassword,
} from "../api/auth";
import { AuthContext, type User } from "./useAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  function isAuthenticated() {
    if (!token) {
      return false;
    }
    if (user === undefined) {
      return undefined;
    }
    return !!user;
  }

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const data = await getCurrentUser(token);
          setUser(data.user);
        } catch {
          localStorage.removeItem("token");
          setToken(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }

    checkAuth();
  }, [token]);

  const login = async (username: string, password: string) => {
    const data = await apiLogin({ username, password });
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
  };

  // creates a new account without replacing the session of the logged user
  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    await apiRegister({ email, password, username });
  };

  const registerWithCode = async (
    email: string,
    password: string,
    username: string,
    invitationid: string
  ) => {
    const data = await apiRegisterWithCode({
      email,
      password,
      username,
      invitationid,
    });
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // the reset doesn't return a session: the user logs in again with the new password
  const updatePassword = async (resetToken: string, newPassword: string) => {
    await apiUpdatePassword({ token: resetToken, newPassword });
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        registerWithCode,
        logout,
        updatePassword,
        isAuthenticated: isAuthenticated(),
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
