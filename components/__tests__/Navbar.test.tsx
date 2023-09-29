import { fireEvent, render, screen } from "@testing-library/react";
import Navbar from "../Navbar";

const getPath = jest.fn(() => "/test");
const getSession = jest.fn(() => ({ data: false }));

jest.mock("next-auth/react", () => ({
  useSession: () => getSession(),
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    asPath: getPath(),
  }),
}));

// TODO: Maybe this better?
// jest.mock("next/router", () => ({
//   useRouter() {
//     return {
//       asPath: "",
//     };
//   },
// }));
// const useRouter = jest.spyOn(require("next/router"), "useRouter");
// useRouter.mockImplementation(() => ({
//   asPath: "/about",
// }));

describe("Navbar", () => {
  it("renders", () => {
    render(<Navbar />);

    const navbar = screen.getByRole("navigation");
    expect(navbar).toBeInTheDocument();
  });

  it("renders with the correct classnames", () => {
    render(<Navbar />);

    const navbar = screen.getByRole("navigation");
    expect(navbar).toHaveClass("navbar");
    expect(navbar).toHaveClass("navbar-expand-lg");
    expect(navbar).toHaveClass("navbar-dark");
  });

  it("renders with the correct color when scrolled down", () => {
    render(<Navbar />);

    const navbar = screen.getByRole("navigation");
    fireEvent.scroll(window, { target: { scrollY: 100 } });

    expect(navbar).toHaveClass("navbar");
    expect(navbar).toHaveClass("navbar-expand-lg");
    expect(navbar).toHaveClass("navbar-light");
  });

  it("renders with the correct color when scrolled down 'on reload'", () => {
    // Scroll down before rendering
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    render(<Navbar />);

    const navbar = screen.getByRole("navigation");

    expect(navbar).toHaveClass("navbar");
    expect(navbar).toHaveClass("navbar-expand-lg");
    expect(navbar).toHaveClass("navbar-light");
  });
});

describe("Navbar - Links", () => {
  const navItems = 8;

  beforeEach(() => {
    getPath.mockReset();
  });

  it("renders about page link with the correct classnames", () => {
    getPath.mockImplementation(() => "/about");
    render(<Navbar />);

    const link = screen.getByText("About Us");
    expect(link).toHaveAttribute("href", "/about");
    expect(link).toHaveClass("nav-link");
    expect(link).toHaveClass("active");
  });

  it("renders menu page link with the correct href", () => {
    getPath.mockImplementation(() => "/menu");
    render(<Navbar />);

    const link = screen.getByText("Menu");
    expect(link).toHaveAttribute("href", "/menu");
    expect(link).toHaveClass("nav-link");
    expect(link).toHaveClass("active");
  });

  it("renders events page link with the correct href", () => {
    getPath.mockImplementation(() => "/events");
    render(<Navbar />);

    const link = screen.getByText("Special Events");
    expect(link).toHaveAttribute("href", "/events");
    expect(link).toHaveClass("nav-link");
    expect(link).toHaveClass("active");
  });

  it("renders home page link with the correct href", () => {
    getPath.mockImplementation(() => "/");
    render(<Navbar />);

    // Note: There's two Avanti links; one each for small/large screens
    //      and neither of them have the active class applied when on the home page
    const links = screen.getAllByText("Avanti", { exact: false });
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/");
      expect(link).toHaveClass("navbar-brand");
    }
  });

  it("renders gallery page link with the correct href", () => {
    getPath.mockImplementation(() => "/gallery");
    render(<Navbar />);

    const link = screen.getByText("Some Photos");
    expect(link).toHaveAttribute("href", "/gallery");
    expect(link).toHaveClass("nav-link");
    expect(link).toHaveClass("active");
  });

  it("renders contact page link with the correct href", () => {
    getPath.mockImplementation(() => "/contact");
    render(<Navbar />);

    const link = screen.getByText("Contact Us");
    expect(link).toHaveAttribute("href", "/contact");
    expect(link).toHaveClass("nav-link");
    expect(link).toHaveClass("active");
  });

  it("renders login page link with the correct href", () => {
    getPath.mockImplementation(() => "/login");
    render(<Navbar />);

    const link = screen.getByText("Login");
    expect(link).toHaveAttribute("href", "/login");
    expect(link).toHaveClass("nav-link");
    expect(link).toHaveClass("active");
  });

  it("renders admin page link with the correct href", () => {
    getPath.mockImplementation(() => "/admin");
    getSession.mockImplementation(() => ({ data: true }));

    render(<Navbar />);

    const link = screen.getByText("Admin");
    expect(link).toHaveAttribute("href", "/admin/overview");
    expect(link).toHaveClass("nav-link");
    expect(link).toHaveClass("active");
  });

  // TODO: Add tests for collapse functionality?
  // TODO: Not sure if needed as this should already be covered by tests in react-bootstrap
});
