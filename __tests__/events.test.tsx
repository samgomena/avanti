import { render, screen } from "@testing-library/react";
import Events from "../pages/events";
import { ParallaxProvider } from "react-scroll-parallax";

describe("Events", () => {
  it("fucking renders", () => {
    render(
      <ParallaxProvider>
        <Events />
      </ParallaxProvider>
    );

    const heading = screen.getByText("Special Events");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("display-6", "fw-bold", "text-white");
  });
});
