import { render, screen } from "@testing-library/react";
import NavLink from "../NavLink";

jest.mock("next/router", () => ({
  useRouter: () => ({
    asPath: "/test",
  }),
}));

describe("NavLink", () => {
  it("renders", () => {
    render(<NavLink href="/test">Test</NavLink>);

    const link = screen.getByText("Test");
    expect(link).toBeInTheDocument();
  });

  it("renders with the correct classnames", () => {
    render(<NavLink href="/test">Test</NavLink>);

    const link = screen.getByText("Test");
    expect(link).toHaveClass("nav-link");
    expect(link).toHaveClass("active");
  });

  it("renders with the correct classnames when not active", () => {
    render(<NavLink href="/test2">Test</NavLink>);

    const link = screen.getByText("Test");
    expect(link).toHaveClass("nav-link");
    expect(link).not.toHaveClass("active");
  });

  it("renders with the correct classnames when subMenu", () => {
    render(
      <NavLink href="/not-active" subMenu>
        Test
      </NavLink>
    );

    const link = screen.getByText("Test");
    expect(link).not.toHaveClass("active");
    expect(link).toHaveClass(
      "nav-link",
      "ms-4",
      "border-start",
      "border-secondary-subtle"
    );
  });

  it("renders with the correct classnames when active and subMenu", () => {
    render(
      <NavLink href="/test" subMenu>
        Test
      </NavLink>
    );

    const link = screen.getByText("Test");
    expect(link).toHaveClass(
      "nav-link",
      "active",
      "ms-4",
      "border-start",
      "border-secondary-subtle"
    );
  });
});
