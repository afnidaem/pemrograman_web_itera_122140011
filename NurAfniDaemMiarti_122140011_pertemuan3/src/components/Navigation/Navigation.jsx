import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation = () => {
  return (
    <nav className={styles.navigation}>
      <div className={styles.logo}>
        <h1>MyLibrare</h1>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? styles.activeLink : styles.navLink
            }
            end
          >
            Buku Saya
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/stats" 
            className={({ isActive }) => 
              isActive ? styles.activeLink : styles.navLink
            }
          >
            Statistik
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;