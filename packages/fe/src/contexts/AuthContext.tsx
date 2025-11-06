// fe/src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  login as apiLogin,
  register as apiRegister,
  registerWithCode as apiRegisterWithCode,
  getCurrentUser,
  updatePassword as apiUpdatePassword,
} from "../api/auth";

type User = {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);
  const isUserLoaded = user !== undefined;

  useEffect(() => {
    if (!token) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const data = await getCurrentUser(token);
          setUser(data.user);
        } catch (error) {
          localStorage.removeItem("token");
          setToken(null);
        }
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

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    const data = await apiRegister({ email, password, username });
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
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

  const updatePassword = async (token: string, newPassword: string) => {
    const data = await apiUpdatePassword({ token, newPassword });
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
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
        isAuthenticated: isUserLoaded ? !!user : undefined,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
