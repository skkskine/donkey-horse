import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

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

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-black text-white flex text-center justify-center">
        <div className="max-w-xl w-full mx-auto">
          <pre>{art}</pre>
          <Outlet />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
