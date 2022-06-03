import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

const fakeInfo = {
  about: "Test about us text",
  contact: {
    address: "Test address",
    email: "test@example.com",
    phone: "1234567890",
  },
  hoursPreview: [
    {
      day: "monday",
      open: null,
      close: null,
    },
    {
      day: "tuesday",
      open: "16:00",
      close: "21:00",
    },
    {
      day: "wednesday",
      open: "16:00",
      close: "21:00",
    },
    {
      day: "thursday",
      open: "16:00",
      close: "21:00",
    },
    {
      day: "friday",
      open: "16:00",
      close: "22:00",
    },
    {
      day: "saturday",
      open: "16:00",
      close: "22:00",
    },
    {
      day: "sunday",
      open: "16:00",
      close: "21:00",
    },
  ],
};
jest.mock("../../lib/hooks/useInfo", () => ({
  __esModule: true,
  default: jest.fn(() => fakeInfo),
}));

describe("Footer", () => {
  it("renders", () => {
    render(<Footer />);

    const aboutUs = screen.getByText("About Us");
    const contactInfo = screen.getByText("Contact Info");
    const hours = screen.getByText("Hours");
    const copyright = screen.getByText("Copyright", { exact: false });

    expect(aboutUs).toBeInTheDocument();
    expect(contactInfo).toBeInTheDocument();
    expect(hours).toBeInTheDocument();
    expect(copyright).toBeInTheDocument();
  });

  describe("Use info correctly", () => {
    it("renders info from hook", () => {
      render(<Footer />);

      const about = screen.getByText(fakeInfo.about);
      const address = screen.getByText(fakeInfo.contact.address);
      const email = screen.getByText(fakeInfo.contact.email);
      const phone = screen.getByText(fakeInfo.contact.phone.slice(0, 3), {
        exact: false,
      });

      expect(about).toBeInTheDocument();
      expect(address).toBeInTheDocument();
      expect(email).toBeInTheDocument();
      expect(phone).toBeInTheDocument();
    });

    it("has appropriate links for address, phone, and email", () => {
      render(<Footer />);

      const addressLink = screen.getByText(fakeInfo.contact.address);
      const emailLink = screen.getByText(fakeInfo.contact.email);
      const phoneLink = screen.getByText(fakeInfo.contact.phone.slice(0, 3), {
        exact: false,
      });

      expect(addressLink).toHaveAttribute("href");
      expect(addressLink).toHaveAttribute("target", "_blank");
      expect(addressLink).toHaveAttribute("rel", "noreferrer");

      expect(emailLink).toHaveAttribute(
        "href",
        "mailto:" + fakeInfo.contact.email
      );

      expect(phoneLink).toHaveAttribute(
        "href",
        "tel:" + fakeInfo.contact.phone
      );
    });
  });
});
