import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const getNavClass = useCallback(
    (path: string) => `nav-link ${router.asPath === path ? "active" : ""}`,
    [router]
  );

  return (
    <nav className="navbar navbar-dark navbar-expand-lg navbar-togglable fixed-top">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand d-lg-none">Avanti</a>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/about">
                <a className={getNavClass("/about")}>About Us</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/menu">
                <a className={getNavClass("/menu")}>Menu</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/events">
                <a className={getNavClass("/events")}>Special Events</a>
              </Link>
            </li>
          </ul>

          <Link href="/">
            <a className="navbar-brand d-none d-lg-flex mx-lg-auto">Avanti</a>
          </Link>

          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/gallery">
                <a className={getNavClass("/gallery")}>Some Photos</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/contact">
                <a className={getNavClass("/contact")}>Contact Us</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
