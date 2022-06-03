import { render, screen, fireEvent } from "@testing-library/react";
import Alerts from "../Alerts";
import type { Alert } from "../../lib/types/alerts";

const title = "Test Alert";
const text = "This is a test alert";

jest.useFakeTimers().setSystemTime(new Date("2020-06-01T00:00:00.000Z"));
const defaultExport = jest.fn(
  () =>
    [
      {
        title,
        text,
        start: "2020-05-01T00:00:00.000Z",
        end: "2020-07-01T00:00:00.000Z",
      },
    ] as Alert[]
);

jest.mock("../../lib/hooks/useAlerts", () => ({
  __esModule: true,
  default: () => defaultExport(),
}));

describe("Alerts", () => {
  beforeEach(() => {
    defaultExport.mockReset();
  });

  it("Renders", () => {
    defaultExport.mockImplementation(() => [
      {
        title,
        text,
        start: "2020-05-01T00:00:00.000Z",
        end: "2020-07-01T00:00:00.000Z",
      },
    ]);

    render(<Alerts />);
    const alert = screen.getByText(title);
    expect(alert).toBeInTheDocument();
  });

  it("Doesn't show a title if it's not provided", () => {
    defaultExport.mockImplementation(() => [
      {
        text,
        start: "2020-05-01T00:00:00.000Z",
        end: "2020-07-01T00:00:00.000Z",
      },
    ]);

    render(<Alerts />);
    const alert = screen.getByText(text);
    expect(alert).toBeInTheDocument();
  });

  it("Closes alert when close button is clicked", () => {
    defaultExport.mockImplementation(() => [
      {
        title,
        text,
        start: "2020-05-01T00:00:00.000Z",
        end: "2020-07-01T00:00:00.000Z",
      },
    ]);

    render(<Alerts />);
    const alert = screen.getByText(title);
    expect(alert).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: "Close alert" });
    fireEvent.click(closeButton);
    expect(alert).not.toBeInTheDocument();
  });

  describe("Edge cases", () => {
    it("Alert hasn't started yet", () => {
      defaultExport.mockImplementation(() => [
        {
          title,
          text,
          // Note: System time is 2020-06-01T00:00:00.000Z
          start: "2020-06-02T00:00:00.000Z",
          end: "2020-07-01T00:00:00.000Z",
        },
      ]);

      render(<Alerts />);
      const alert = screen.queryByText(title);
      expect(alert).not.toBeInTheDocument();
    });

    it("Alert has already happened", () => {
      defaultExport.mockImplementation(() => [
        {
          title,
          text,
          // Note: System time is 2020-06-01T00:00:00.000Z
          start: "2020-05-01T00:00:00.000Z",
          end: "2020-05-31T00:00:00.000Z",
        },
      ]);

      render(<Alerts />);
      const alert = screen.queryByText(title);
      expect(alert).not.toBeInTheDocument();
    });

    it("Alert is happening - first day", () => {
      defaultExport.mockImplementation(() => [
        {
          title,
          text,
          // Note: System time is 2020-06-01T00:00:00.000Z
          start: "2020-06-01T00:00:00.000Z",
          end: "2020-07-01T00:00:00.000Z",
        },
      ]);

      render(<Alerts />);
      const alert = screen.queryByText(title);
      expect(alert).toBeInTheDocument();
    });

    it("Alert is happening - last day", () => {
      defaultExport.mockImplementation(() => [
        {
          title,
          text,
          // Note: System time is 2020-06-01T00:00:00.000Z
          start: "2020-05-01T00:00:00.000Z",
          end: "2020-06-01T00:00:00.000Z",
        },
      ]);

      render(<Alerts />);
      const alert = screen.queryByText(title);
      expect(alert).toBeInTheDocument();
    });

    it("Alert is happening - one day only", () => {
      defaultExport.mockImplementation(() => [
        {
          title,
          text,
          // Note: System time is 2020-06-01T00:00:00.000Z
          start: "2020-06-01T00:00:00.000Z",
          end: "2020-06-01T00:00:00.000Z",
        },
      ]);

      render(<Alerts />);
      const alert = screen.queryByText(title);
      expect(alert).toBeInTheDocument();
    });
  });
});
