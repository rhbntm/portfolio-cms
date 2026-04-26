import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProjectsList from "../pages/admin/AdminProjectsList";
import AdminProjectCreate from "../pages/admin/AdminProjectCreate";
import AdminProjectEdit from "../pages/admin/AdminProjectEdit";
import AdminPostsList from "../pages/admin/AdminPostsList";
import AdminPostCreate from "../pages/admin/AdminPostCreate";
import AdminPostEdit from "../pages/admin/AdminPostEdit";
import { ProtectedRoute } from "../components";

export const adminRoutes = {
  path: "/admin",
  element: <ProtectedRoute />,
  children: [{
    path: "/admin",
    element: <AdminLayout />,
    children: [
    { index: true, element: <AdminDashboard /> },
    { path: "projects", element: <AdminProjectsList /> },
    { path: "projects/new", element: <AdminProjectCreate /> },
    { path: "projects/:id/edit", element: <AdminProjectEdit /> },
    { path: "posts", element: <AdminPostsList /> },
    { path: "posts/new", element: <AdminPostCreate /> },
    { path: "posts/:id/edit", element: <AdminPostEdit /> },
    ],
  }],
};
