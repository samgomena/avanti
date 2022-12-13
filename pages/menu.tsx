import Header from "../components/Header";
import Heading from "../components/Heading";
import Section from "../components/Section";
import MenuItem from "../components/Menu/MenuItem";
import MenuItemWrapper from "../components/Menu/MenuItemWrapper";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { useMenuBuckets } from "../lib/hooks/useMenu";
import { useFlag } from "../lib/hooks/useFlags";

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

export default function Menu() {
  const menu = useMenuBuckets<React.ReactNode>({
    as: (item, service, idx) => (
      <MenuItem
        key={idx}
        name={item.name}
        description={item.description}
        price={item.price[service]}
      />
    ),
  });

  // TODO(6/4/22): Default active key is always dinner while lunch/hh are disbaled
  // const defaultActiveKey = useMemo(getDefaultActiveKey, []);
  const defaultActiveKey = "dinner";

  const showLunch = useFlag("showLunch");
  const showHh = useFlag("showHh");
  const showDesserts = useFlag("showDesserts");

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
              {showLunch.enabled && (
                <Tab eventKey="lunch" title="Lunch">
                  <MenuItemWrapper>{menu.lunch}</MenuItemWrapper>
                </Tab>
              )}
              <Tab eventKey="dinner" title="Dinner">
                <MenuItemWrapper>{menu.dinner}</MenuItemWrapper>
              </Tab>
              {showHh.enabled && (
                <Tab eventKey="hh" title="HH">
                  <MenuItemWrapper>{menu.hh}</MenuItemWrapper>
                </Tab>
              )}
              <Tab eventKey="drinks" title="Drinks">
                <MenuItemWrapper>{menu.drinks}</MenuItemWrapper>
              </Tab>
              {showDesserts.enabled && (
                <Tab eventKey="dessert" title="Dessert">
                  <MenuItemWrapper>{menu.dessert}</MenuItemWrapper>
                </Tab>
              )}
            </Tabs>
          </div>
        </div>
      </Section>
    </>
  );
}
