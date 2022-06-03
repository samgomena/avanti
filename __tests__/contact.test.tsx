import { render, screen } from "@testing-library/react";
import Contact from "../pages/contact";
import { ParallaxProvider } from "react-scroll-parallax";

describe("Contact", () => {
  it("fucking renders", () => {
    render(
      <ParallaxProvider>
        <Contact />
      </ParallaxProvider>
    );

    const heading = screen.getByText("Contact Us");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("display-6", "fw-bold", "text-white");
  });
});
