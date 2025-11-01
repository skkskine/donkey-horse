import { useState } from "react";
import Button from "../../components/Button";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function PasswordReset() {
  const [newPassword, setNewPassword] = useState("");
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const { updatePassword } = useAuth();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const forgotPasswordMutation = useMutation({
    mutationFn: () => {
      if (!token) {
        throw new Error("a token is required");
      }
      return updatePassword(token, newPassword);
    },
    onSuccess: () => navigate("/login"),
    onError: (error: Error) => setError(error.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    forgotPasswordMutation.mutate();
  }

  return (
    <form className="max-w-60 text-sm" onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="new password"
        className="border-b outline-0 w-full"
        required
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Button className="mt-5" type="submit">
        update
      </Button>
      {error && <p className="mt-3">{error}</p>}
    </form>
  );
}
