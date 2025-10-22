import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Homepage from "./features/homepage/Homepage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Homepage></Homepage>
    </QueryClientProvider>
  );
}

export default App;
