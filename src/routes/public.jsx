import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import { Loading } from "../components";
import { lazyPage } from "./lazy";

export const publicRoutes = {
  path: "/",
  element: <MainLayout />,
  hydrateFallbackElement: <Loading />,
  children: [
    { index: true, element: <Home /> },
    { path: "about", lazy: lazyPage(() => import("../pages/About")) },
    { path: "projects", lazy: lazyPage(() => import("../pages/projects/Projects")) },
    { path: "projects/:slug", lazy: lazyPage(() => import("../pages/projects/ProjectDetail")) },
    { path: "blog", lazy: lazyPage(() => import("../pages/blog/Blog")) },
    { path: "blog/:slug", lazy: lazyPage(() => import("../pages/blog/BlogPost")) },
    { path: "contact", lazy: lazyPage(() => import("../pages/Contact")) },
  ],
};
