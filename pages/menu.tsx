import Header from "@/components/Header";
import Heading from "@/components/Heading";
import MenuDivider from "@/components/Menu/MenuDivider";
import MenuItem from "@/components/Menu/MenuItem";
import MenuItems from "@/components/Menu/MenuItems";
import Section from "@/components/Section";
import type { Bucket } from "@/lib/types/menu";
import { PrismaClient, type Courses, type Prisma } from "@prisma/client";
import { GetStaticProps } from "next";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

/**
 * Given the time of day and the menu, return the appropriate menu item.
 */
const getDefaultActiveKey = () => {
  const hour = new Date().getHours();
  if (hour >= 11 && hour <= 15) {
    return "lunch";
  } else if (hour >= 17 && hour <= 23) {
    return "dinner";
  }

  return "dinner";
};

type MenuProps = {
  apps: Bucket;
  entrees: Bucket;
  drinks: Bucket;
};

export default function Menu({ apps, entrees, drinks }: MenuProps) {
  // TODO(6/4/22): Default active key is always dinner while lunch/hh are disbaled
  // const defaultActiveKey = useMemo(getDefaultActiveKey, []);
  const defaultActiveKey = "dinner";

  console.log(apps, entrees, drinks);

  return (
    <>
      <Header title="Our Menu" image="/assets/photos/porkchop_in_window.jpg" />
      <Section>
        <Heading
          heading="Menu"
          subHeading="Made with a rotating selection of this seasons finest and
                freshest ingredients. (Menu items and prices are subject to
                change)"
        />
        <div className="row">
          <div className="col">
            <Tabs
              defaultActiveKey={defaultActiveKey}
              className="justify-content-center mb-6"
              variant="pills"
            >
              <Tab eventKey="dinner" title="Dinner">
                <MenuItems>
                  <MenuDivider>Appetizers</MenuDivider>
                  {apps.map((item, idx) => (
                    <MenuItem
                      key={idx}
                      name={item.name}
                      description={item.description ?? ""}
                      price={item.price!["dinner"]!}
                    />
                  ))}
                  <MenuDivider>Entrees</MenuDivider>
                  {entrees.map((item, idx) => (
                    <MenuItem
                      key={idx}
                      name={item.name}
                      description={item.description ?? ""}
                      price={item.price!["dinner"]!}
                    />
                  ))}
                </MenuItems>
              </Tab>

              <Tab eventKey="drinks" title="Drinks">
                <MenuItems>
                  {drinks.map((item, idx) => (
                    <MenuItem
                      key={idx}
                      name={item.name}
                      description={item.description ?? ""}
                      price={item.price!["drinks"]!}
                    />
                  ))}
                </MenuItems>
              </Tab>
            </Tabs>
          </div>
        </div>
      </Section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prisma = new PrismaClient();
  const getQueryForCourse = (
    course: Courses,
    selectPrice: Prisma.PriceSelect
  ) => {
    return prisma.menu.findMany({
      orderBy: [{ idx: "asc" }],
      where: {
        disabled: false,
        course,
      },
      select: {
        name: true,
        description: true,
        price: {
          select: selectPrice,
        },
      },
    });
  };

  const apps = await getQueryForCourse("appetizer", { dinner: true });
  const entrees = await getQueryForCourse("entree", { dinner: true });
  const drinks = await getQueryForCourse("drink", { drinks: true });

  return {
    props: {
      apps,
      entrees,
      drinks,
    },
  };
};
