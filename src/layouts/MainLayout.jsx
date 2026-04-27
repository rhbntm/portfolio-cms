import { Outlet, Link, NavLink } from "react-router-dom";
import styles from './MainLayout.module.css';

export default function MainLayout() {
  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.logo}>Portfolio CMS</Link>
          <div className={styles.navLinks}>
            <NavLink
              to="/projects"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              Projects
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              Blog
            </NavLink>
          </div>
          <div className={styles.navActions}>
            <Link to="/login" className={styles.loginBtn}>Login</Link>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerBrand}>© 2024 Portfolio CMS. All Rights Reserved.</span>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Behance</a>
            <a href="#" className={styles.footerLink}>Dribbble</a>
            <a href="#" className={styles.footerLink}>LinkedIn</a>
          </div>
        </div>
      </footer>
    </>
  );
}