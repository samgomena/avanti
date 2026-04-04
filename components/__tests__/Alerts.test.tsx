import type { AlertListItem } from "../Alerts";
import { fireEvent, render, screen } from "@testing-library/react";
import Alerts from "../Alerts";
import { vi } from "vitest";

const title = "Test Alert";
const text = "This is a test alert";

vi.useFakeTimers().setSystemTime(new Date("2020-06-01T00:00:00.000Z"));

describe("Alerts", () => {
  it("Renders", () => {
    const alerts = [
      {
        id: "a1",
        title,
        text,
        start: "2020-05-01T00:00:00.000Z",
        end: "2020-07-01T00:00:00.000Z",
      },
    ] as AlertListItem[];

    render(<Alerts alerts={alerts} />);
    const alert = screen.getByText(title);
    expect(alert).toBeInTheDocument();
  });

  it("Doesn't show a title if it's not provided", () => {
    const alerts = [
      {
        id: "a2",
        title: null,
        text,
        start: "2020-05-01T00:00:00.000Z",
        end: "2020-07-01T00:00:00.000Z",
      },
    ] as AlertListItem[];

    render(<Alerts alerts={alerts} />);
    const alert = screen.getByText(text);
    expect(alert).toBeInTheDocument();
  });

  it("Closes alert when close button is clicked", () => {
    const alerts = [
      {
        id: "a3",
        title,
        text,
        start: "2020-05-01T00:00:00.000Z",
        end: "2020-07-01T00:00:00.000Z",
      },
    ] as AlertListItem[];

    render(<Alerts alerts={alerts} />);
    const alert = screen.getByText(title);
    expect(alert).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: "Close alert" });
    fireEvent.click(closeButton);
    expect(alert).not.toBeInTheDocument();
  });

  describe("Edge cases", () => {
    it("Alert hasn't started yet", () => {
      const alerts = [
        {
          id: "a4",
          title,
          text,
          // Note: System time is 2020-06-01T00:00:00.000Z
          start: "2020-06-02T00:00:00.000Z",
          end: "2020-07-01T00:00:00.000Z",
        },
      ] as AlertListItem[];

      render(<Alerts alerts={alerts} />);
      const alert = screen.queryByText(title);
      expect(alert).not.toBeInTheDocument();
    });

    it("Alert has already happened", () => {
      const alerts = [
        {
          id: "a5",
          title,
          text,
          // Note: System time is 2020-06-01T00:00:00.000Z
          start: "2020-05-01T00:00:00.000Z",
          end: "2020-05-31T00:00:00.000Z",
        },
      ] as AlertListItem[];

      render(<Alerts alerts={alerts} />);
      const alert = screen.queryByText(title);
      expect(alert).not.toBeInTheDocument();
    });

    it("Alert is happening - first day", () => {
      const alerts = [
        {
          id: "a6",
          title,
          text,
          // Note: System time is 2020-06-01T00:00:00.000Z
          start: "2020-06-01T00:00:00.000Z",
          end: "2020-07-01T00:00:00.000Z",
        },
      ] as AlertListItem[];

      render(<Alerts alerts={alerts} />);
      const alert = screen.queryByText(title);
      expect(alert).toBeInTheDocument();
    });

    it("Alert is happening - last day", () => {
      const alerts = [
        {
          id: "a7",
          title,
          text,
          // Note: System time is 2020-06-01T00:00:00.000Z
          start: "2020-05-01T00:00:00.000Z",
          end: "2020-06-01T00:00:00.000Z",
        },
      ] as AlertListItem[];

      render(<Alerts alerts={alerts} />);
      const alert = screen.queryByText(title);
      expect(alert).toBeInTheDocument();
    });

    it("Alert is happening - one day only", () => {
      const alerts = [
        {
          id: "a8",
          title,
          text,
          // Note: System time is 2020-06-01T00:00:00.000Z
          start: "2020-06-01T00:00:00.000Z",
          end: "2020-06-01T00:00:00.000Z",
        },
      ] as AlertListItem[];

      render(<Alerts alerts={alerts} />);
      const alert = screen.queryByText(title);
      expect(alert).toBeInTheDocument();
    });
  });
});
