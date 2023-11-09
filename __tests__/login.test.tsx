import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/login";
import { ParallaxProvider } from "react-scroll-parallax";

jest.mock("next/router", () => ({
  useRouter: () => ({}),
}));

describe("Login", () => {
  it("fucking renders", () => {
    render(
      <ParallaxProvider>
        <Login />
      </ParallaxProvider>
    );

    const heading = screen.getByText("Login");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("display-6", "fw-bold", "text-white");
  });
});

describe("Login - Form", () => {
  it("Errors if no email is entered", async () => {
    render(
      <ParallaxProvider>
        <Login />
      </ParallaxProvider>
    );

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByText("login");

    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(
        screen.getByText("Your email is required to log in!")
      ).toBeInTheDocument()
    );
  });

  it("Errors if email entered is invalid", async () => {
    render(
      <ParallaxProvider>
        <Login />
      </ParallaxProvider>
    );

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByText("login");

    fireEvent.change(emailInput, { target: { value: "notavalidemail" } });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText("That's not a valid email!")).toBeInTheDocument()
    );
  });

  // Removed 4/7/23
  // Tests for password field if you end up adding that in the future
  // it("Errors if no password is entered", async () => {
  //   render(
  //     <ParallaxProvider>
  //       <Login />
  //     </ParallaxProvider>
  //   );

  //   const emailInput = screen.getByLabelText("Email");
  //   const passwordInput = screen.getByLabelText("Password");
  //   const submitButton = screen.getByText("login");

  //   fireEvent.change(emailInput, { target: { value: "email@example.com" } });
  //   fireEvent.change(passwordInput, { target: { value: "" } });
  //   fireEvent.click(submitButton);

  //   await waitFor(() =>
  //     expect(
  //       screen.getByText("Your password is required to log in!")
  //     ).toBeInTheDocument()
  //   );
  // });

  // it("Shows password when show password check is clicked", async () => {
  //   render(
  //     <ParallaxProvider>
  //       <Login />
  //     </ParallaxProvider>
  //   );

  //   const emailInput = screen.getByLabelText("Email");
  //   const passwordInput = screen.getByLabelText("Password");
  //   const showPasswordCheckbox = screen.getByLabelText("Show password");

  //   fireEvent.change(emailInput, { target: { value: "email@example.com" } });
  //   fireEvent.change(passwordInput, { target: { value: "password" } });
  //   fireEvent.click(showPasswordCheckbox);

  //   await waitFor(() => expect(passwordInput).toHaveAttribute("type", "text"));
  // });
});
