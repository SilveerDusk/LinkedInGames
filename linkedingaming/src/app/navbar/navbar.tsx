"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/navbar/navbar.module.css";

export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(false);

  const handleHideNavbar = () => {
    setShowNavbar(false);
  };    

  return (
    <nav className={`${styles.navbar} ${showNavbar && styles.active}`}>
      <div className={styles.container} style={{ fontFamily: 'Lato' }}>
        <div className={`${styles.nav_elements}  ${showNavbar && styles.active}`}>
          <ul>
            <li>
              <Link href="/leaderboard" onClick={handleHideNavbar}>
                View Leaderboard
              </Link>
            </li>
           <li>
              <Link href="/upload" onClick={handleHideNavbar}>
                Upload Scores
              </Link>
            </li>
            <li>
              <Link href="/" onClick={handleHideNavbar}>
                Login
              </Link>
            </li>
          </ul>
        </div>         
      </div>
    </nav>
  );
}
