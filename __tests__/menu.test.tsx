import { render, screen } from "@testing-library/react";
import Menu from "../pages/menu";
import { ParallaxProvider } from "react-scroll-parallax";

describe("Menu", () => {
  it("fucking renders", () => {
    render(
      <ParallaxProvider>
        <Menu />
      </ParallaxProvider>
    );

    const heading = screen.getByText("Our Menu");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("display-6", "fw-bold", "text-white");
  });

  it("Has all the tabs", () => {
    render(
      <ParallaxProvider>
        <Menu />
      </ParallaxProvider>
    );

    ["Dinner", "Drinks"].forEach((_tab) => {
      const tab = screen.getByText(_tab);
      expect(tab).toBeInTheDocument();
      expect(tab).toHaveClass("nav-link");
      expect(tab);
    });
  });

  it("Has dinner selected by default", () => {
    render(
      <ParallaxProvider>
        <Menu />
      </ParallaxProvider>
    );

    const tab = screen.getByText("Dinner");
    expect(tab).toBeInTheDocument();
    expect(tab).toHaveClass("active");
  });
});
