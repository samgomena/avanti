import Link from "next/link";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AvantiNavbar() {
  const router = useRouter();
  const [navbarTheme, setNavbarTheme] = useState<"dark" | "light">("dark");

  const handleScroll = useCallback(() => {
    if (window.pageYOffset <= 1) {
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
    } else if (!window.pageYOffset) {
      setNavbarTheme("dark");
    }
  }, []);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      variant={navbarTheme}
      fixed="top"
      onToggle={handleToggle}
    >
      <div className="container">
        <Link href="/" passHref>
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
              <Link href="/about" passHref>
                <Nav.Link active={router.asPath === "/about"}>
                  About Us
                </Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link href="/menu" passHref>
                <Nav.Link active={router.asPath === "/menu"}>Menu</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link href="/events" passHref>
                <Nav.Link active={router.asPath === "/events"}>
                  Special Events
                </Nav.Link>
              </Link>
            </Nav.Item>
          </Nav>

          <Link href="/" passHref>
            <Navbar.Brand
              href="/"
              className="navbar-brand d-none d-lg-flex mx-lg-auto"
            >
              Avanti
            </Navbar.Brand>
          </Link>

          <Nav>
            <Nav.Item>
              <Link href="/gallery" passHref>
                <Nav.Link active={router.asPath === "/gallery"}>
                  Some Photos
                </Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link href="/contact" passHref>
                <Nav.Link active={router.asPath === "/contact"}>
                  Contact Us
                </Nav.Link>
              </Link>
            </Nav.Item>

            <Nav.Item>
              <Link href="/login" passHref>
                <Nav.Link active={router.asPath === "/login"}>Login</Nav.Link>
              </Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
