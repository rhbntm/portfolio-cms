import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Projects from "../pages/projects/Projects";
import ProjectDetail from "../pages/projects/ProjectDetail";
import Blog from "../pages/blog/Blog";
import BlogPost from "../pages/blog/BlogPost";

export const publicRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    { index: true, element: <Home /> },
    { path: "projects", element: <Projects /> },
    { path: "projects/:slug", element: <ProjectDetail /> },
    { path: "blog", element: <Blog /> },
    { path: "blog/:slug", element: <BlogPost /> },
  ],
};
