import { useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import styles from './MainLayout.module.css';

export default function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
            Ralph Brent Marcelo
          </Link>
          
          <button
            className={`${styles.mobileToggle} ${isMenuOpen ? styles.mobileToggleActive : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

          <div className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksMobileOpen : ''}`}>
            <NavLink
              to="/about"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
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
          <span className={styles.footerBrand}>© {new Date().getFullYear()} Ralph Brent Marcelo.</span>
          <div className={styles.footerLinks}>
            <a href="https://github.com/rhbntm" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>GitHub</a>
            <a href="https://linkedin.com/in/rhbntm" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>LinkedIn</a>
          </div>
        </div>
      </footer>
    </>
  );
}