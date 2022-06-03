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
});
