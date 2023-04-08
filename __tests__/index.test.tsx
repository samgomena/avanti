import { render, screen } from "@testing-library/react";
import Home from "../pages/index";
import { ParallaxProvider } from "react-scroll-parallax";

const defaultProps = {
  alerts: [],
  info: {
    contact: { facebook: "facebook.com", instagram: "instagram.com" },
  },
};

describe("Home - Headings", () => {
  it("fucking renders", () => {
    render(
      <ParallaxProvider>
        <Home {...defaultProps} />
      </ParallaxProvider>
    );

    const heading = screen.getByText("Avanti");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("display-1", "text-white", "mb-4");
  });

  it("has correct sub-heading (restaurant)", () => {
    render(
      <ParallaxProvider>
        <Home {...defaultProps} />
      </ParallaxProvider>
    );

    const subheading = screen.getByText("Restaurant");
    expect(subheading).toBeInTheDocument();
    expect(subheading).toHaveClass("text-primary");
  });

  it("has correct sub-heading (& bar)", () => {
    render(
      <ParallaxProvider>
        <Home {...defaultProps} />
      </ParallaxProvider>
    );

    const subheading = screen.getByText("/ Bar");
    expect(subheading).toBeInTheDocument();
    expect(subheading).toHaveClass("text-xs", "text-white-75");
  });

  it("has correct sub-heading (location)", () => {
    render(
      <ParallaxProvider>
        <Home {...defaultProps} />
      </ParallaxProvider>
    );

    const subheading = screen.getByText("Located in", { exact: false });
    expect(subheading).toBeInTheDocument();
    expect(subheading).toHaveClass("text-center", "text-white-75", "mb-7");
  });
});

describe("Home - Reservations", () => {
  it("Shows a reservation button if enabled", () => {
    jest.mock("../lib/hooks/useFlags");
    const useFlag = require("../lib/hooks/useFlags").useFlag;
    // useFlag.mockImplementation(() => ({ enabled: true }));
    useFlag.mockReturnValue({ enabled: true });

    render(
      <ParallaxProvider>
        <Home {...defaultProps} />
      </ParallaxProvider>
    );

    const reservationButton = screen.getByText("Reserve a Table");
    expect(reservationButton).toBeInTheDocument();
    expect(reservationButton).toHaveAttribute(
      "href",
      "https://www.opentable.com/r/avanti-reservations-west-linn?restref=1277137&lang=en-US&ot_source=Restaurant%20website"
    );
  });
});
