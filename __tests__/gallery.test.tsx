import { render, screen } from "@testing-library/react";
import Gallery from "../pages/gallery";
import { ParallaxProvider } from "react-scroll-parallax";

describe("Gallery", () => {
  it("fucking renders", () => {
    render(
      <ParallaxProvider>
        <Gallery />
      </ParallaxProvider>
    );

    const heading = screen.getByText("Some Photos");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("display-6", "fw-bold", "text-white");
  });
});
