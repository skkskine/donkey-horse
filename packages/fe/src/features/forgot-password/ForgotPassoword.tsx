import { useState } from "react";
import Button from "../../components/Button";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../api/password";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    forgotPasswordMutation.mutate();
  }

  const forgotPasswordMutation = useMutation({
    mutationFn: () => forgotPassword(email),
    onSuccess: () => setLinkSent(true),
  });

  return (
    <form className="max-w-60 text-sm" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="email"
        className="border-b outline-0 w-full"
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button className="mt-5" type="submit">
        send password reset link
      </Button>
      {linkSent && <p>link sent! check your inbox</p>}
    </form>
  );
}
