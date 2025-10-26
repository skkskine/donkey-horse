import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Footer from "../components/Footer";

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
      <NavLink
        to="/account"
        className={({ isActive }) => highlightCurrentPage(isActive)}
      >
        account
      </NavLink>
    </nav>
  );

  return (
    <div className="min-h-screen bg-black text-white flex text-center items-center flex-col">
      <div className="grow">
        {isAuthenticated && navbar}
        <main className="max-w-xl w-full mx-auto px-4">
          <Link to="/">
            <pre>{art}</pre>
          </Link>
          <Outlet />
        </main>
      </div>

      <Footer></Footer>
    </div>
  );
}

export default App;
