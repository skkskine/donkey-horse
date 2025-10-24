// fe/src/components/Register.tsx
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("passwords are not the same");
      return;
    }

    if (password.length < 6) {
      setError("password should be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, username);
    } catch (err) {
      setError(err instanceof Error ? err.message : "registration error");
    } finally {
      setIsLoading(false);
      navigate("/login");
    }
  };

  return (
    <div>
      <form
        className="text-sm flex w-full mx-auto max-w-60 flex-col items-center gap-3 [&>input]:border-b [&>input]:outline-0 [&>input]:w-full"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          id="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          id="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          id="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        <input
          type="password"
          id="confirmPassword"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="border p-2 rounded-md mt-3 hover:bg-white hover:text-black hover:cursor-pointer"
        >
          {isLoading ? "is registering..." : "register"}
        </button>

        {error && <p>{error}</p>}
      </form>

      <p className="text-sm mt-6">
        have an account?{" "}
        <Link to="/login" className="underline">
          login
        </Link>
      </p>
    </div>
  );
}
