import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./public";
import { adminRoutes } from "./admin";
import { Loading } from "../components";
import { lazyPage } from "./lazy";

export const router = createBrowserRouter([
  publicRoutes,
  { path: "/login", lazy: lazyPage(() => import("../pages/Login")), hydrateFallbackElement: <Loading /> },
  adminRoutes,
]);
