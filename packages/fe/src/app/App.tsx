import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

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

  return (
    <div className="min-h-screen bg-black text-white flex text-center items-center flex-col">
      <div className="grow">
        {isAuthenticated && <Navbar></Navbar>}
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
