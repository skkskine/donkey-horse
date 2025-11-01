import { useMutation } from "@tanstack/react-query";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { forgotPassword } from "../../api/password";

export default function Account() {
  const { user, logout } = useAuth();
  const [linkSent, setLinkSent] = useState(false);

  const updatePasswordMutation = useMutation({
    mutationFn: () => {
      if (!user?.email) {
        throw new Error("you are not authenticated");
      }
      return forgotPassword(user.email);
    },
    onSuccess: () => setLinkSent(true),
  });

  return (
    <div className="text-sm">
      <p className="mb-6">hello {user?.username}</p>
      <Button className="mb-3" onClick={() => updatePasswordMutation.mutate()}>
        update password
      </Button>
      <br />
      <Button styleType="danger" onClick={logout}>
        logout
      </Button>
      {linkSent && (
        <p className="mt-3">
          update link sent!<br></br>check your inbox at {user?.email}
        </p>
      )}
    </div>
  );
}
