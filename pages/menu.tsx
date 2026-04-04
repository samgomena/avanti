import Header from "@/components/Header";
import Heading from "@/components/Heading";
import MenuDivider from "@/components/Menu/MenuDivider";
import MenuItem from "@/components/Menu/MenuItem";
import MenuItems from "@/components/Menu/MenuItems";
import Section from "@/components/Section";
import { drizzleDb } from "@/lib/db/libsql";
import { menu } from "@/lib/db/schema";
import type { Bucket } from "@/lib/types/menu";
import type { Course } from "@/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { GetStaticProps } from "next";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

/**
 * Given the time of day and the menu, return the appropriate menu selection
 */
// const getDefaultActiveKey = () => {
//   const hour = new Date().getHours();
//   if (hour >= 11 && hour <= 15) {
//     return "lunch";
//   } else if (hour >= 17 && hour <= 23) {
//     return "dinner";
//   }

//   return "dinner";
// };

type MenuProps = {
  apps: Bucket;
  entrees: Bucket;
  drinks: Bucket;
};

async function loadBucketForCourse(course: Course): Promise<Bucket> {
  const rows = await drizzleDb.query.menu.findMany({
    where: and(eq(menu.disabled, false), eq(menu.course, course)),
    orderBy: [asc(menu.idx)],
    columns: {
      name: true,
      description: true,
    },
    with: {
      price: {
        columns: { dinner: true, drinks: true },
      },
    },
  });

  return rows.map((row) => ({
    name: row.name,
    description: row.description,
    price: row.price
      ? {
          dinner: row.price.dinner || null,
          drinks: row.price.drinks || null,
        }
      : null,
  }));
}

export default function Menu({ apps, entrees, drinks }: MenuProps) {
  // TODO(6/4/22): Default active key is always dinner while lunch/hh are disbaled
  // const defaultActiveKey = useMemo(getDefaultActiveKey, []);
  const defaultActiveKey = "dinner";

  return (
    <>
      <Header title="Our Menu" image="/assets/photos/avanti_menu_item_21.jpg" />
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
                      price={item.price?.dinner ?? ""}
                    />
                  ))}
                  <MenuDivider>Entrees</MenuDivider>
                  {entrees.map((item, idx) => (
                    <MenuItem
                      key={idx}
                      name={item.name}
                      description={item.description ?? ""}
                      price={item.price?.dinner ?? ""}
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
                      price={item.price?.drinks ?? ""}
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
  const [apps, entrees, drinks] = await Promise.all([
    loadBucketForCourse("appetizer"),
    loadBucketForCourse("entree"),
    loadBucketForCourse("drink"),
  ]);

  return {
    props: {
      apps,
      entrees,
      drinks,
    },
  };
};
