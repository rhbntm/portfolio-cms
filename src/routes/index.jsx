import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./public";
import { adminRoutes } from "./admin";
import { Loading, RouteError } from "../components";
import { lazyPage } from "./lazy";

export const router = createBrowserRouter([
  publicRoutes,
  { path: "/login", lazy: lazyPage(() => import("../pages/Login")), errorElement: <RouteError />, hydrateFallbackElement: <Loading /> },
  adminRoutes,
]);
