import Header from "../components/Header";
import Heading from "../components/Heading";
import Section from "../components/Section";
import MenuItem from "../components/Menu/MenuItem";
import MenuItemWrapper from "../components/Menu/MenuItemWrapper";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Service, Services, Item } from "../components/Menu/types";

import menuJson from "../data/menu.json";

const menu = menuJson.services.reduce(
  (acc, curr) => ({ [curr]: new Array(), ...acc }),
  {} as { [k in Service]: JSX.Element[] }
);

menuJson.items.forEach((item, idx) => {
  const services = item.service as Services;
  services.forEach((service) => {
    const price: number =
      // @ts-ignore
      typeof item.price === "object" ? item.price[service] : item.price;
    menu[service].push(
      <MenuItem
        key={idx}
        name={item.name}
        description={item.description}
        price={price}
      />
    );
  });
});

export default function Menu() {
  return (
    <>
      <Header
        title="Our Menu"
        image="/assets/photos/Porkchop_In_Window_322_KB.jpg"
      />
      <Section>
        <Heading
          heading="Menu"
          subHeading="Made with a rotating selection of this seasons finest and
                freshest ingredients. (Menu items and prices are subject to
                change)"
        />
        <div className="row">
          <div className="col">
            {/* Set `variant` to a madeup value as a workaround to the default value of `tabs` which applies inconsistent styling to the custom "tabs" we created in bootstrap*/}
            {/* See: https://github.com/react-bootstrap/react-bootstrap/blob/daf5a9ef95f6db05a6915e19d7acfb41bc0b7d5f/src/Nav.tsx#L161 */}
            <Tabs
              className="justify-content-center mb-6"
              // @ts-ignore
              variant="not-tabs-or-pills"
            >
              <Tab eventKey="lunch" title="Lunch">
                <MenuItemWrapper>{menu.lunch}</MenuItemWrapper>
              </Tab>
              <Tab eventKey="dinner" title="Dinner">
                <MenuItemWrapper>{menu.dinner}</MenuItemWrapper>
              </Tab>
              <Tab eventKey="hh" title="HH">
                <MenuItemWrapper>{menu.hh}</MenuItemWrapper>
              </Tab>
              <Tab eventKey="drinks" title="Drinks">
                <MenuItemWrapper>{menu.drinks}</MenuItemWrapper>
              </Tab>
            </Tabs>
          </div>
        </div>
      </Section>
    </>
  );
}
