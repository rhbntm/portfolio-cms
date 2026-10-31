import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import { Loading, NotFound, RouteError } from "../components";
import { lazyPage } from "./lazy";

export const publicRoutes = {
  path: "/",
  element: <MainLayout />,
  errorElement: <RouteError />,
  hydrateFallbackElement: <Loading />,
  children: [{
    // Pathless so page errors render inside MainLayout and keep the nav
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", lazy: lazyPage(() => import("../pages/About")) },
      { path: "projects", lazy: lazyPage(() => import("../pages/projects/Projects")) },
      { path: "projects/:slug", lazy: lazyPage(() => import("../pages/projects/ProjectDetail")) },
      { path: "blog", lazy: lazyPage(() => import("../pages/blog/Blog")) },
      { path: "blog/:slug", lazy: lazyPage(() => import("../pages/blog/BlogPost")) },
      { path: "contact", lazy: lazyPage(() => import("../pages/Contact")) },
      { path: "*", element: <NotFound /> },
    ],
  }],
};
