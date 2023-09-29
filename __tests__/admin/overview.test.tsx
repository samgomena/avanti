import { getServerSideProps } from "@/pages/admin/overview";
import { fireEvent, render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { ParsedUrlQuery } from "querystring";
import { Course } from "../../lib/types/menu";
import Overview from "../../pages/admin/overview";

jest.mock("next-auth/react");
jest.mock("next/router", () => ({
  useRouter: () => ({
    asPath: "/test",
  }),
}));

describe("Overview renders stuff", () => {
  it("fucking renders", () => {
    render(<Overview menu={[]} />);

    const heading = screen.getByTestId("title");
    expect(heading).toBeInTheDocument();

    const table = screen.getByTestId("table");
    expect(table).toBeInTheDocument();
  });
});

describe("Overview table renders stats", () => {
  const menu = [
    {
      course: "entree" as Course,
      disabled: false,
      price: {
        lunch: 10,
        dinner: 12,
        hh: null,
        drinks: null,
        dessert: null,
      },
    },
    {
      course: "appetizer" as Course,
      disabled: false,
      price: {
        lunch: 10,
        dinner: 12,
        hh: 6,
        drinks: null,
        dessert: null,
      },
    },
    {
      course: "drink" as Course,
      disabled: true,
      price: {
        dinner: null,
        lunch: null,
        hh: null,
        drinks: 10,
        dessert: null,
      },
    },
  ];

  it("Shows headers", () => {
    render(<Overview menu={menu} />);

    ["Appetizers", "Entrees", "Drinks", "Dessert"].map((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("Shows averages", () => {
    render(<Overview menu={menu} />);

    const avgApps = screen.getByTestId("avg_0");
    expect(avgApps).toBeInTheDocument();
    expect(avgApps.innerHTML).toBe("$9.33");

    const avgEntrees = screen.getByTestId("avg_1");
    expect(avgEntrees).toBeInTheDocument();
    expect(avgEntrees.innerHTML).toBe("$11.00");

    const avgDrinks = screen.getByTestId("avg_2");
    expect(avgDrinks).toBeInTheDocument();
    expect(avgDrinks.innerHTML).toBe("$0.00");

    const checkbox = screen.getByTestId<HTMLInputElement>(
      "include-hidden-checkbox"
    );
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    const avgAfterCheck = screen.getByTestId("avg_2");
    expect(avgAfterCheck.innerHTML).toBe("$10.00");
  });

  it("Shows mins", () => {
    render(<Overview menu={menu} />);

    const minApps = screen.getByTestId("min_0");
    expect(minApps).toBeInTheDocument();
    expect(minApps.innerHTML).toBe("$6");

    const minEntrees = screen.getByTestId("min_1");
    expect(minEntrees).toBeInTheDocument();
    expect(minEntrees.innerHTML).toBe("$10");

    const minDrinks = screen.getByTestId("min_2");
    expect(minDrinks).toBeInTheDocument();
    expect(minDrinks.innerHTML).toBe("$1000");

    const checkbox = screen.getByTestId<HTMLInputElement>(
      "include-hidden-checkbox"
    );
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    const minAfterCheck = screen.getByTestId("min_2");
    expect(minAfterCheck.innerHTML).toBe("$10");
  });

  it("Shows maxs", () => {
    render(<Overview menu={menu} />);

    const maxApps = screen.getByTestId("max_0");
    expect(maxApps).toBeInTheDocument();
    expect(maxApps.innerHTML).toBe("$12");

    const maxEntrees = screen.getByTestId("max_1");
    expect(maxEntrees).toBeInTheDocument();
    expect(maxEntrees.innerHTML).toBe("$12");

    const maxDrinks = screen.getByTestId("max_2");
    expect(maxDrinks).toBeInTheDocument();
    expect(maxDrinks.innerHTML).toBe("$0");

    const checkbox = screen.getByTestId<HTMLInputElement>(
      "include-hidden-checkbox"
    );
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    const maxAfterCheck = screen.getByTestId("max_2");
    expect(maxAfterCheck.innerHTML).toBe("$10");
  });
});

test("Kicks you out when you're not logged in", async () => {
  global.fetch = jest.fn(() => {}) as unknown as typeof global.fetch;
  (getSession as jest.Mock).mockReturnValue(false);

  const context = {
    params: {} as ParsedUrlQuery,
    resolvedUrl: "/what",
  };

  const response = await getServerSideProps(
    context as GetServerSidePropsContext
  );

  expect(response).toEqual({
    redirect: { permanent: false, destination: "/login?wantsUrl=/what" },
  });
});

// TODO: This fails because prisma isn't mocked but mocking prisma is non-trivial
// See: https://www.prisma.io/docs/guides/testing/unit-testing
// And: https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o
// test("Lets you in when you're logged in", async () => {
//   global.fetch = jest.fn(() => {}) as unknown as typeof global.fetch;
//   (getSession as jest.Mock).mockReturnValue(true);
//   const context = {
//     params: {} as ParsedUrlQuery,
//   };

//   const response = await getServerSideProps(
//     context as GetServerSidePropsContext
//   );

//   expect(response).toEqual({
//     redirect: { permanent: false, destination: "/login?wantsUrl=/nah" },
//   });
// });
