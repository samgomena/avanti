import { render, screen } from "@testing-library/react";
import About from "../pages/about";
import { ParallaxProvider } from "react-scroll-parallax";

describe("About", () => {
  it("fucking renders", () => {
    render(
      <ParallaxProvider>
        <About />
      </ParallaxProvider>
    );

    const heading = screen.getByText("About Us");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("display-6", "fw-bold", "text-white");
  });
});
