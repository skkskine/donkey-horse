import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  const art = String.raw`
            .''
  ._.-.___.' (\`\
  //(        ( \`'
'/ )\ ).__. )
' <' \`\. _/'\
    \`   \     \
  `;

  function highlightCurrentPage(isActive: boolean) {
    return isActive ? "underline" : "";
  }

  const navbar = (
    <nav className="flex justify-center w-full gap-3 p-2 text-sm">
      <NavLink
        to="/"
        className={({ isActive }) => highlightCurrentPage(isActive)}
      >
        homepage
      </NavLink>
      <NavLink
        to="/add-event"
        className={({ isActive }) => highlightCurrentPage(isActive)}
      >
        add-event
      </NavLink>
      <NavLink
        to="/invite"
        className={({ isActive }) => highlightCurrentPage(isActive)}
      >
        invite
      </NavLink>
    </nav>
  );

  return (
    <div className="min-h-screen bg-black text-white flex text-center items-center flex-col">
      {isAuthenticated && navbar}
      <div className="max-w-xl w-full mx-auto px-4">
        <pre>{art}</pre>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
