"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import styles from "./sidebar.module.css";

const pages = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "",
  },
  {
    name: "Portfolio",
    href: "/portfolio/",
    icon: "",
  },
  {
    name: "Performance",
    href: "",
    icon: "",
  },
  {
    name: "Advice",
    href: "/statements",
    icon: "",
  },
  {
    name: "Profile",
    href: "/profile",
    icon: "",
  },
  // {
  //   name: "Settings",
  //   href: "",
  //   icon: ""
  // }
];

const NavLink = ({ page, activePath }) => {
  return (
    <Link
      className={
        page.href === activePath
          ? styles["sidebar-nav-list-item-current"]
          : styles["sidebar-nav-list-item-other"]
      }
      href={page.href}
    >
      <div className={styles["sidebar-text-container"]}>
        <div className={styles["sidebar-icon"]}>{page.icon}</div>
        <div className={styles["sidebar-text"]}>{page.name}</div>
      </div>
    </Link>
  );
};

export default function SideBar() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState();

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  return (
    <>
      <div
        data-animation="over-left"
        data-collapse="medium"
        data-duration="400"
        data-easing="ease"
        data-doc-height="1"
        role="banner"
        className={styles["sidebar-wrapper"]}
      >
        <div>
          <div className={styles["sidebar-logo-section-container"]}>
            <a href="/" className={styles["sidebar-logo-wrapper"]}>
              <Image
                src="/palladian.svg"
                alt="Palladian Logo"
                width={100}
                height={100}
              />
            </a>
          </div>
          <div>
            <nav role="navigation" className={styles["sidebar-nav-menu"]}>
              <div className={styles["sidebar-menu-wrapper"]}>
                <div role="list" className={styles["sidebar-nav-menu-list"]}>
                  {pages.map((page, index) => (
                    <NavLink key={index} page={page} activePath={activePath} />
                  ))}
                </div>
                <div className="divider _40px bg-neutral-300"></div>
                <div role="list" className={styles["sidebar-nav-menu-list"]}>
                  <li className={styles["sidebar-nav-list-item-other"]}>
                    <div className={styles["sidebar-text-container"]}>
                      <div className={styles["sidebar-icon"]}></div>
                      <div className={styles["sidebar-text"]}>Settings</div>
                    </div>
                  </li>
                </div>
              </div>
            </nav>
            <div className={styles["hamburger-menu-wrapper"]}>
              <div className={styles["hamburger-menu-bar"]} />
              <div className={styles["hamburger-menu-bar"]} />
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar-spacer" />
    </>
  );
}
