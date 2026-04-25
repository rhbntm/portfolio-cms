import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./public";
import { adminRoutes } from "./admin";
import Login from "../pages/Login";

export const router = createBrowserRouter([
  publicRoutes,
  { path: "/login", element: <Login /> },
  adminRoutes,
]);