import { createBrowserRouter } from "react-router-dom";
import Homepage from "./../features/homepage/Homepage";
import HandleEvent from "../features/handle-event/HandleEvent";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/add-event", element: <HandleEvent type="add" /> },
      { path: "/edit-event/:id", element: <HandleEvent type="edit" /> },
    ],
  },
]);
