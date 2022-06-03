import { render, screen } from "@testing-library/react";
import Heading from "../Heading";

describe("Heading", () => {
  it("renders", () => {
    const headingText = "Heading Text";
    const subHeadingText = "Sub Heading Text";
    render(<Heading heading={headingText} subHeading={subHeadingText} />);

    const heading = screen.getByText(headingText);
    const subHeading = screen.getByText(subHeadingText);

    expect(heading).toBeInTheDocument();
    expect(subHeading).toBeInTheDocument();
  });

  it("Doesn't render a sub-heading when one isn't given", () => {
    const headingText = "Heading Text";
    const { container } = render(<Heading heading={headingText} />);

    const heading = screen.getByText(headingText);

    expect(heading).toBeInTheDocument();
    expect(container.getElementsByTagName("p")).toHaveLength(0);
  });
});
