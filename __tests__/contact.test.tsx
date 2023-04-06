import { render, screen } from "@testing-library/react";
import Contact from "../pages/contact";
import { ParallaxProvider } from "react-scroll-parallax";

const defaultContactProps = {
  contact: {
    address: "",
    phone: "",
    email: "",
    facebook: "",
    instagram: "",
  },
};

describe("Contact", () => {
  it("fucking renders", () => {
    render(
      <ParallaxProvider>
        <Contact info={defaultContactProps} />
      </ParallaxProvider>
    );

    const heading = screen.getByText("Contact Us");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("display-6", "fw-bold", "text-white");
  });
});

describe("Contact renders info", () => {
  it("email", () => {
    render(
      <ParallaxProvider>
        <Contact
          info={{
            contact: {
              ...defaultContactProps.contact,
              email: "test@example.com",
            },
          }}
        />
      </ParallaxProvider>
    );

    const heading = screen.getByText("Write us");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("mb-2", "text-xs");

    const link = screen.getByText("test@example.com");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "mailto:test@example.com");
  });

  it("phone", () => {
    render(
      <ParallaxProvider>
        <Contact
          info={{
            contact: {
              ...defaultContactProps.contact,
              phone: "1234567890",
            },
          }}
        />
      </ParallaxProvider>
    );

    const heading = screen.getByText("Call us");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("mb-2", "text-xs");

    const link = screen.getByText("(123)-456-7890");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "tel:1234567890");
  });

  it("address", () => {
    render(
      <ParallaxProvider>
        <Contact
          info={{
            contact: {
              ...defaultContactProps.contact,
              address: "123 1st ave",
            },
          }}
        />
      </ParallaxProvider>
    );

    const heading = screen.getByText("Visit us");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("mb-2", "text-xs");

    const link = screen.getByText("123 1st ave");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "https://goo.gl/maps/rgDVKbs6SsXyUxiU9"
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  describe("Social", () => {
    it("has socials", () => {
      render(
        <ParallaxProvider>
          <Contact
            info={{
              contact: {
                ...defaultContactProps.contact,
                facebook: "facebook",
                instagram: "instagram",
              },
            }}
          />
        </ParallaxProvider>
      );

      const heading = screen.getByText("Social");
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass("mb-4", "text-xs");
    });

    it("facebook", () => {
      render(
        <ParallaxProvider>
          <Contact
            info={{
              contact: {
                ...defaultContactProps.contact,
                facebook: "https://example.com/facebook",
              },
            }}
          />
        </ParallaxProvider>
      );

      const link = screen.getByTitle("facebook");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://example.com/facebook");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    });

    it("instagram", () => {
      render(
        <ParallaxProvider>
          <Contact
            info={{
              contact: {
                ...defaultContactProps.contact,
                instagram: "https://example.com/instagram",
              },
            }}
          />
        </ParallaxProvider>
      );

      const link = screen.getByTitle("instagram");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://example.com/instagram");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    });
  });
});
