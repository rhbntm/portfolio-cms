import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./public";
import { adminRoutes } from "./admin";

export const router = createBrowserRouter([publicRoutes, adminRoutes]);