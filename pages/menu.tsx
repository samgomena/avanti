import Image from "next/image";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Section from "../components/Section";

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
            <div
              className="nav justify-content-center mb-6"
              id="menuTabs"
              role="tablist"
            >
              <a
                className="nav-link active"
                id="mainsTab"
                data-bs-toggle="tab"
                href="#mains"
                role="tab"
                aria-controls="mains"
                aria-selected="true"
              >
                Mains
              </a>
              <a
                className="nav-link"
                id="lunchTab"
                data-bs-toggle="tab"
                href="#lunch"
                role="tab"
                aria-controls="lunch"
              >
                Lunch
              </a>
              <a
                className="nav-link"
                id="dinnerTab"
                data-bs-toggle="tab"
                href="#dinner"
                role="tab"
                aria-controls="dinner"
              >
                Dinner
              </a>
              <a
                className="nav-link"
                id="drinksTab"
                data-bs-toggle="tab"
                href="#drinks"
                role="tab"
                aria-controls="drinks"
              >
                Drinks
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
