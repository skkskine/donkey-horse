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
      <div className="min-h-screen bg-black">
        <div className="text-white text-center">
          <pre>{art}</pre>
        </div>
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}

export default App;
