import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-light navbar-expand-lg fixed-top">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand d-lg-none">Avanti</a>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link href="/about">
                <a className="nav-link">About Us</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/menu">
                <a className="nav-link" id="nav-item__menu">
                  Menu
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/events">
                <a className="nav-link">Special Events</a>
              </Link>
            </li>
          </ul>

          <Link href="/">
            <a className="navbar-brand d-none d-lg-flex">Avanti</a>
          </Link>

          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link href="/gallery">
                <a className="nav-link">Some Photos</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/contact">
                <a className="nav-link">Contact Us</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
