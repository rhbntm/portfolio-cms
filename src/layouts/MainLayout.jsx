import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/projects">Projects</Link> | 
        <Link to="/blog">Blog</Link>
      </nav>

      <Outlet />
    </div>
  );
}