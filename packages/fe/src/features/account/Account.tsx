import { useMutation } from "@tanstack/react-query";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface FormData {
  password: string;
}

export default function Account() {
  const { user, logout, updatePassword } = useAuth();
  const [formData, setFormData] = useState<FormData>({ password: "" });
  const navigate = useNavigate();

  const updatePasswordMutation = useMutation({
    mutationFn: () => updatePassword(formData.password, user?.username || ""),
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updatePasswordMutation.mutate();
  };

  function updateFormValue(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="text-sm">
      <p className="mb-6">hello {user?.username}</p>
      <form
        onSubmit={handleSubmit}
        className=" border border-dashed text-sm border-white p-5 mb-5 max-w-70 [&>input]:border-b [&>input]:outline-0 [&>input]:w-full"
      >
        <input
          name="password"
          type="password"
          placeholder="new password"
          className="block mx-auto mb-1"
          required
          minLength={8}
          onChange={updateFormValue}
        ></input>
        <Button className="mt-4" type="submit">
          update password
        </Button>
      </form>

      <Button styleType="danger" onClick={logout}>
        logout
      </Button>
    </div>
  );
}
