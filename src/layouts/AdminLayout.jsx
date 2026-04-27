import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../lib/auth";
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarLogo}>Portfolio CMS</span>
          <span className={styles.sidebarEnv}>admin</span>
        </div>
        <nav className={styles.sidebarNav}>
          <span className={styles.sidebarSection}>Content</span>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/projects"
            className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
          >
            Projects
          </NavLink>
          <NavLink
            to="/admin/posts"
            className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
          >
            Posts
          </NavLink>
        </nav>
        <div className={styles.logoutArea}>
          <button className={styles.logoutBtn} onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}