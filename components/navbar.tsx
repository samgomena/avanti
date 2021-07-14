import { Collapse } from "bootstrap";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const getNavClass = useCallback(
    (path: string) => `nav-link ${router.asPath === path ? "active" : ""}`,
    [router]
  );

  const [navbarTheme, setNavbarTheme] = useState<"dark" | "light">("dark");
  const [showCollapse, setShowCollapse] = useState(false);
  const navbarCollapse = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset;
    if (scrollTop <= 1) {
      setNavbarTheme("dark");
    } else {
      setNavbarTheme("light");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    console.log("what");
    // const navbarCollapse = document.getElementById("navbarCollapse");
    console.log(document);
    if (document) {
      console.log("wtaf");
      // const bsCollapse =
      //   navbarCollapse.current &&
      //   new Collapse(navbarCollapse.current, { toggle: false });
      // showCollapse ? bsCollapse?.show() : bsCollapse?.hide();
    }
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-togglable fixed-top navbar-${navbarTheme}`}
    >
      <div className="container">
        <Link href="/">
          <a className="navbar-brand d-lg-none">Avanti</a>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShowCollapse((showCollapse) => !showCollapse)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse`}
          ref={navbarCollapse}
          id="navbarCollapse"
        >
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
