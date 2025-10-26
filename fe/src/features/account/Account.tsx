import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";

export default function Account() {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <div className="text-sm">
      <p>hello {user?.username}</p>
      <Button styleType="danger" className="mt-5" onClick={handleLogout}>
        logout
      </Button>
    </div>
  );
}
