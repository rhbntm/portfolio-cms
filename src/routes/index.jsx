import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import Blog from "../pages/Blog";
import BlogPost from "../pages/BlogPost";
import AdminProjectsList from "../pages/AdminProjectsList";
import AdminProjectCreate from "../pages/AdminProjectCreate";
import AdminProjectEdit from "../pages/AdminProjectEdit";

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
      { path: "admin/projects", element: <AdminProjectsList /> },
      { path: "admin/projects/new", element: <AdminProjectCreate /> },
      { path: "admin/projects/:id/edit", element: <AdminProjectEdit /> },
    ],
  },
]);