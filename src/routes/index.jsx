import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import Blog from "../pages/Blog";
import BlogPost from "../pages/BlogPost";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProjectsList from "../pages/AdminProjectsList";
import AdminProjectCreate from "../pages/AdminProjectCreate";
import AdminProjectEdit from "../pages/AdminProjectEdit";
import AdminPostsList from "../pages/AdminPostsList";
import AdminPostCreate from "../pages/AdminPostCreate";
import AdminPostEdit from "../pages/AdminPostEdit";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "projects", element: <Projects /> },
      { path: "projects/:slug", element: <ProjectDetail /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/:slug", element: <BlogPost /> },
    ],
  },
  {
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
  },
]);