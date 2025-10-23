import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link, NavLink, Outlet } from "react-router-dom";

const queryClient = new QueryClient();

function App() {
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

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-black text-white flex text-center items-center flex-col">
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
            add event
          </NavLink>
        </nav>
        <div className="max-w-xl w-full mx-auto">
          <pre>{art}</pre>
          <Outlet />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
