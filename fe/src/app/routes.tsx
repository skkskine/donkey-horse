import { createBrowserRouter } from "react-router-dom";
import Homepage from "./../features/homepage/Homepage";
import AddEvent from "./../features/add-event/AddEvent";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/add-event", element: <AddEvent /> },
    ],
  },
]);
