import Image from "next/image";
import Header from "../components/Header";
import Section from "../components/Section";

export default function Menu() {
  return (
    <>
      <Header title="Our Menu" />
      <section className="py-7 py-md-9 border-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center">
              <h2 className="mb-2">Menu</h2>

              <p className="mb-6">
                Made with a rotating selection of this seasons finest and
                freshest ingredients. (Menu items and prices are subject to
                change)
              </p>
            </div>
          </div>

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
        </div>
      </section>
    </>
  );
}
