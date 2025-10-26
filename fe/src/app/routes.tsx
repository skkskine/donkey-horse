import { createBrowserRouter } from "react-router-dom";
import Homepage from "./../features/homepage/Homepage";
import HandleEvent from "../features/handle-event/HandleEvent";
import App from "./App";
import { Login } from "../features/admin/Login";
import { Register } from "../features/admin/Register";
import { ProtectedRoute } from "../features/admin/ProtectedRoute";
import Invite from "../features/invite/Invite";
import Account from "../features/account/Account";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/login", element: <Login /> },
      {
        path: "/register",
        element: (
          <ProtectedRoute>
            <Register />
          </ProtectedRoute>
        ),
      },
      { path: "/register/:invitationid", element: <Register /> },
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
      {
        path: "/invite",
        element: (
          <ProtectedRoute>
            <Invite />
          </ProtectedRoute>
        ),
      },
      {
        path: "/account",
        element: (
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
