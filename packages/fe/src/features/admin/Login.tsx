// fe/src/components/Login.tsx
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "login error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="text-sm flex w-full mx-auto max-w-60 flex-col items-center gap-3 [&>input]:border-b [&>input]:outline-0 [&>input]:w-full"
      onSubmit={handleSubmit}
    >
      <input
        type="username"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="border p-2 rounded-md mt-3 hover:bg-white hover:text-black hover:cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? "loading..." : "login"}
      </button>
      {error && <p className="text-xs mt-3">{error}</p>}
    </form>
  );
}
