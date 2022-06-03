import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/login";
import { ParallaxProvider } from "react-scroll-parallax";

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
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByText("login");

    // "Touch" email field
    // fireEvent.blur(emailInput);
    // await waitFor(() => screen.findByText("Your email is required to log in!"));

    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
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
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByText("login");

    fireEvent.change(emailInput, { target: { value: "notavalidemail" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText("That's not a valid email!")).toBeInTheDocument()
    );
  });

  it("Errors if no password is entered", async () => {
    render(
      <ParallaxProvider>
        <Login />
      </ParallaxProvider>
    );

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByText("login");

    fireEvent.change(emailInput, { target: { value: "email@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(
        screen.getByText("Your password is required to log in!")
      ).toBeInTheDocument()
    );
  });

  it("Shows password when show password check is clicked", async () => {
    render(
      <ParallaxProvider>
        <Login />
      </ParallaxProvider>
    );

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const showPasswordCheckbox = screen.getByLabelText("Show password");

    fireEvent.change(emailInput, { target: { value: "email@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(showPasswordCheckbox);

    await waitFor(() => expect(passwordInput).toHaveAttribute("type", "text"));
  });
});
