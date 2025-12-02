import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function AvantiNavbar() {
  const router = useRouter();
  const [navbarTheme, setNavbarTheme] = useState<"dark" | "light">(() => {
    // Initialize based on scroll position (handles scroll restoration on page reload)
    if (typeof window !== "undefined" && window.scrollY > 1) {
      return "light";
    }
    return "dark";
  });

  const { data: session } = useSession();

  const handleScroll = useCallback(() => {
    if (window.scrollY <= 1) {
      setNavbarTheme("dark");
    } else {
      setNavbarTheme("light");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleToggle = useCallback((expanded: boolean) => {
    if (expanded) {
      setNavbarTheme("light");
    } else if (!window.scrollY) {
      setNavbarTheme("dark");
    }
  }, []);

  const isLoggedInPath = session ? "/admin/overview" : "/login";

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      variant={navbarTheme}
      fixed="top"
      onToggle={handleToggle}
    >
      <div className="container">
        <Link href="/" passHref legacyBehavior>
          <Navbar.Brand href="/" className="d-lg-none">
            Avanti
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle
          className=""
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse>
          <Nav>
            <Nav.Item>
              <Link href="/about" passHref legacyBehavior>
                <Nav.Link active={router.asPath === "/about"}>
                  About Us
                </Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link href="/menu" passHref legacyBehavior>
                <Nav.Link
                  active={router.asPath === "/menu"}
                  data-umami-event="Menu-Navbar-Clicked"
                >
                  Menu
                </Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link href="/events" passHref legacyBehavior>
                <Nav.Link active={router.asPath === "/events"}>
                  Special Events
                </Nav.Link>
              </Link>
            </Nav.Item>
          </Nav>

          <Link href="/" passHref legacyBehavior>
            <Navbar.Brand
              href="/"
              className="navbar-brand d-none d-lg-flex mx-lg-auto"
            >
              Avanti
            </Navbar.Brand>
          </Link>

          <Nav>
            <Nav.Item>
              <Link href="/gallery" passHref legacyBehavior>
                <Nav.Link active={router.asPath === "/gallery"}>
                  Some Photos
                </Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link href="/contact" passHref legacyBehavior>
                <Nav.Link active={router.asPath === "/contact"}>
                  Contact Us
                </Nav.Link>
              </Link>
            </Nav.Item>

            <Nav.Item>
              <Link href={isLoggedInPath} passHref legacyBehavior>
                <Nav.Link
                  active={
                    router.asPath === "/login" ||
                    router.asPath.startsWith("/admin")
                  }
                >
                  {session ? "Admin" : "Login"}
                </Nav.Link>
              </Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
