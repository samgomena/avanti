import { render, screen } from "@testing-library/react";
import Home from "../pages/index";
import { ParallaxProvider } from "react-scroll-parallax";
import { vi } from "vitest";
import type { Alert, Contact, Info } from "@prisma/client";

const defaultProps: {
  alerts: Alert[];
  info: Info & { contact: Omit<Contact, "id"> };
} = {
  alerts: [
    {
      id: "123",
      title: "Watch out!!!",
      text: "A very important alert",
      start: new Date("2024-07-18"),
      end: new Date("2024-07-19"),
    },
  ],
  info: {
    id: "123",
    contactId: "1234",
    about: "what",
    contact: {
      facebook: "facebook.com",
      instagram: "instagram.com",
      email: "test@avantiwestlinn.com",
      address: "42 P Wallaby way",
      phone: "1234567890",
    },
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
    vi.mock("../lib/hooks/useFlags");
    // TODO: This is already enabled so the test is useless but maybe good reference?
    // const useFlag = require("@/lib/hooks/useFlags").useFlag;
    // // useFlag.mockImplementation(() => ({ enabled: true }));
    // useFlag.mockReturnValue({ enabled: true });

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

// TODO
// describe("Home - Alerts", () => {
//   it("Shows an alert", () => {
//     render(
//       <ParallaxProvider>
//         <Home {...defaultProps} />
//       </ParallaxProvider>
//     );

//     expect(screen.getByText("Woah!")).toBeInTheDocument();
//   });
// });
