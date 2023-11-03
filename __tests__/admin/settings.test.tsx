import Settings from "@/pages/admin/settings";
import { render, screen } from "@testing-library/react";
import { formatDate } from "../../lib/utils/utils";

jest.mock("next/router", () => ({
  useRouter: () => ({
    asPath: "/test",
  }),
}));

describe("Overview renders stuff", () => {
  it("fucking renders", () => {
    // @ts-expect-error Just make it render
    render(<Settings user={{}} />);

    const heading = screen.getByTestId("title");
    expect(heading).toBeInTheDocument();
  });
});

test("It shows to relevant infoz", () => {
  const createdAt = new Date();
  const updatedAt = new Date();
  const fakeUser = {
    id: "abc-123-not-a-real-cuid",
    name: "Testing McTestface",
    email: "fake@lolz.com",
    emailVerified: null,
    image: null,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };

  render(<Settings user={fakeUser} />);

  expect(screen.getByText(`Name: ${fakeUser.name}`)).toBeInTheDocument();
  expect(screen.getByText(`Email: ${fakeUser.email}`)).toBeInTheDocument();

  expect(
    screen.getByText(
      `Last updated: ${formatDate(fakeUser.updatedAt.toISOString())}`
    )
  ).toBeInTheDocument();

  expect(
    screen.getByText(`Created: ${formatDate(fakeUser.createdAt.toISOString())}`)
  ).toBeInTheDocument();
});
