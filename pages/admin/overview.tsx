import { Courses } from "@prisma/client";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import { useCallback, useState } from "react";
import { Form, Table } from "react-bootstrap";
import prisma from "../../lib/prismadb";
import withAdminNav from "../../lib/withAdminNav";

type OverviewProps = {
  course: Courses;
  disabled: boolean;
  price: {
    dinner: string;
    lunch: string;
    hh: string;
    drinks: string;
    dessert: string;
  };
}[];

const Overview: React.FC<{ menu: OverviewProps }> = ({ menu }) => {
  const [includeDisabled, setIncludeDisabled] = useState(false);

  let sumCourse = useCallback(
    (course: Courses) =>
      menu
        // Grab only the items for the course we're getting stats for
        .filter((item) => item.course === course)
        // Either remove disabled entries or include everything
        .filter((item) => (includeDisabled ? true : item.disabled === false))
        // Reduce price object into array of values; in the future it could be cool to show values per service period
        .reduce(
          (acc, curr) => [
            ...acc,
            curr.price.dinner,
            curr.price.lunch,
            curr.price.hh,
            curr.price.drinks,
            curr.price.dessert,
          ],
          [] as string[]
        )
        // Remove nulls from the list of prices (i.e. when a price isn't defined for a service period)
        // This is a shitty workaround to not have to jump through a bunch of hoops with ts + array.filter
        // See: https://stackoverflow.com/a/59726888/4668680
        .flatMap((item) => item ?? [])
        // Remove empty string values
        .filter(Boolean)
        // Convert array of strings to numbers
        .map(Number)
        // Finally, calculate stats!
        .reduce(
          (acc, curr, _, { length }) => ({
            max: curr >= acc.max ? curr : acc.max,
            min: curr <= acc.min ? curr : acc.min,
            avg: acc.avg + curr / length,
          }),
          // Set max to 0 so that items is always greater than it
          // Set min to 1_000 so that items is always less than it
          { max: 0, min: 1_000, avg: 0.0 }
        ),
    [menu, includeDisabled]
  );

  const appetizerSums = sumCourse("appetizer");
  const entreeSums = sumCourse("entree");
  const drinkSums = sumCourse("drink");
  const dessertSum = sumCourse("dessert");

  const data = [
    { title: "Appetizers", data: appetizerSums },
    { title: "Entrees", data: entreeSums },
    { title: "Drinks", data: drinkSums },
    { title: "Dessert", data: dessertSum },
  ];

  return (
    <div className="row justify-content-center">
      <div className="col">
        <div className="col-3 col-md-8 col-lg-9">
          <h3 data-testid="title">Overview</h3>
        </div>

        <Table striped bordered hover responsive data-testid="table">
          <thead>
            <tr>
              <th></th>
              {data.map((item) => (
                <th key={item.title}>{item.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Average</td>
              {data.map((item, idx) => (
                <td key={`avg_${idx}`} data-testid={`avg_${idx}`}>
                  ${item.data.avg.toFixed(2)}
                </td>
              ))}
            </tr>
            <tr>
              <td>Min</td>
              {data.map((item, idx) => (
                <td key={`min_${idx}`} data-testid={`min_${idx}`}>
                  ${item.data.min}
                </td>
              ))}
            </tr>
            <tr>
              <td>Max</td>
              {data.map((item, idx) => (
                <td key={`max_${idx}`} data-testid={`max_${idx}`}>
                  ${item.data.max}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>
        <Form.Check
          type="checkbox"
          checked={includeDisabled}
          onChange={(event) => setIncludeDisabled(event.target.checked)}
          label="Include hidden"
          data-testid="include-hidden-checkbox"
          id="include-hidden-checkbox"
        />
      </div>
    </div>
  );
};

export default withAdminNav(Overview);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: `/login?wantsUrl=${ctx.resolvedUrl}`,
      },
    };
  }

  const menu = await prisma.menu.findMany({
    select: {
      course: true,
      disabled: true,
      price: {
        select: {
          dinner: true,
          lunch: true,
          hh: true,
          drinks: true,
          dessert: true,
        },
      },
    },
  });

  return {
    props: {
      menu,
    },
  };
};
