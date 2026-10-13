import { ProtectedRoute, Loading } from "../components";
import { lazyPage } from "./lazy";

export const adminRoutes = {
  path: "/admin",
  element: <ProtectedRoute />,
  hydrateFallbackElement: <Loading />,
  children: [{
    path: "/admin",
    lazy: lazyPage(() => import("../layouts/AdminLayout")),
    children: [
    { index: true, lazy: lazyPage(() => import("../pages/admin/AdminDashboard")) },
    { path: "projects", lazy: lazyPage(() => import("../pages/admin/AdminProjectsList")) },
    { path: "projects/new", lazy: lazyPage(() => import("../pages/admin/AdminProjectCreate")) },
    { path: "projects/:id/edit", lazy: lazyPage(() => import("../pages/admin/AdminProjectEdit")) },
    { path: "posts", lazy: lazyPage(() => import("../pages/admin/AdminPostsList")) },
    { path: "posts/new", lazy: lazyPage(() => import("../pages/admin/AdminPostCreate")) },
    { path: "posts/:id/edit", lazy: lazyPage(() => import("../pages/admin/AdminPostEdit")) },
    ],
  }],
};
