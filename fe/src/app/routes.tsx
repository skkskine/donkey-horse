import { createBrowserRouter } from "react-router-dom";
import Homepage from "./../features/homepage/Homepage";
import HandleEvent from "../features/handle-event/HandleEvent";
import App from "./App";
import { Login } from "../features/admin/Login";
import { Register } from "../features/admin/Register";
import { ProtectedRoute } from "../features/admin/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/add-event",
        element: (
          <ProtectedRoute>
            <HandleEvent type="add" />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-event/:id",
        element: (
          <ProtectedRoute>
            <HandleEvent type="edit" />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
