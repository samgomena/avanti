import dynamic from "next/dynamic";
import Image, { StaticImageData } from "next/image";

import Header from "../components/Header";
import Heading from "../components/Heading";
import Section from "../components/Section";

import ahi_nicoise_salad from "../public/assets/photos/ahi_nicoise_salad.jpg";
import baby_kale_salad from "../public/assets/photos/baby_kale_salad.jpg";
import bloody_mary from "../public/assets/photos/bloody_mary.jpg";
import blt_with_fries from "../public/assets/photos/blt_with_fries.jpg";
import braised_halibut from "../public/assets/photos/braised_halibut.jpg";
import caprese from "../public/assets/photos/caprese.jpg";
import cheese_burger from "../public/assets/photos/cheese_burger.jpg";
import cheese_plate from "../public/assets/photos/cheese_plate.jpg";
import chocolate_souffle from "../public/assets/photos/chocolate_souffle.jpg";
import coconut_shrimp from "../public/assets/photos/coconut_shrimp.jpg";
import creme_brulee from "../public/assets/photos/creme_brulee.jpg";
import fish_and_chips from "../public/assets/photos/fish_and_chips.jpg";
import flatiron_steak from "../public/assets/photos/flatiron_steak.jpg";
import grapefruit_drop from "../public/assets/photos/grapefruit_drop.jpg";
import grilled_chicken from "../public/assets/photos/grilled_chicken.jpg";
import grilled_salmon from "../public/assets/photos/grilled_salmon.jpg";
import pineapple_mule from "../public/assets/photos/pineapple_mule.jpg";
import pork_chop from "../public/assets/photos/pork_chop.jpg";
import pouring_wine from "../public/assets/photos/pouring_wine.jpg";
import serving_libation from "../public/assets/photos/serving_libation.jpg";
import shirley_temple from "../public/assets/photos/shirley_temple.jpg";
import truffled_mushroom_soup from "../public/assets/photos/truffled_mushroom_soup.jpg";

import avanti_menu_item_14 from "../public/assets/photos/avanti_menu_item_14.jpg";
import avanti_menu_item_15 from "../public/assets/photos/avanti_menu_item_15.jpg";
import avanti_menu_item_16 from "../public/assets/photos/avanti_menu_item_16.jpg";
import avanti_menu_item_17 from "../public/assets/photos/avanti_menu_item_17.jpg";
import avanti_menu_item_18 from "../public/assets/photos/avanti_menu_item_18.jpg";
import avanti_menu_item_19 from "../public/assets/photos/avanti_menu_item_19.jpg";
import avanti_menu_item_20 from "../public/assets/photos/avanti_menu_item_20.jpg";
import avanti_menu_item_21 from "../public/assets/photos/avanti_menu_item_21.jpg";
import avanti_menu_item_22 from "../public/assets/photos/avanti_menu_item_22.jpg";
import avanti_menu_item_23 from "../public/assets/photos/avanti_menu_item_23.jpg";
import avanti_menu_item_24 from "../public/assets/photos/avanti_menu_item_24.jpg";
import avanti_menu_item_25 from "../public/assets/photos/avanti_menu_item_25.jpg";
import avanti_menu_item_26 from "../public/assets/photos/avanti_menu_item_26.jpg";
import avanti_menu_item_27 from "../public/assets/photos/avanti_menu_item_27.jpg";
import avanti_menu_item_28 from "../public/assets/photos/avanti_menu_item_28.jpg";
import avanti_menu_item_29 from "../public/assets/photos/avanti_menu_item_29.jpg";
import avanti_menu_item_30 from "../public/assets/photos/avanti_menu_item_30.jpg";
import avanti_menu_item_31 from "../public/assets/photos/avanti_menu_item_31.jpg";
import avanti_menu_item_32 from "../public/assets/photos/avanti_menu_item_32.jpg";
import avanti_menu_item_33 from "../public/assets/photos/avanti_menu_item_33.jpg";
import avanti_menu_item_34 from "../public/assets/photos/avanti_menu_item_34.jpg";
import avanti_menu_item_35 from "../public/assets/photos/avanti_menu_item_35.jpg";
import avanti_menu_item_36 from "../public/assets/photos/avanti_menu_item_36.jpg";
import avanti_menu_item_37 from "../public/assets/photos/avanti_menu_item_37.jpg";
import avanti_menu_item_38 from "../public/assets/photos/avanti_menu_item_38.jpg";

const Masonry = dynamic(() => import("../components/Masonry/Masonry"), {
  // Ensure we load on the client because this component dynamically determines column counts that can mess with hydration
  // See: https://github.com/samgomena/avanti/issues/159
  ssr: false,
});

const mapper = (
  { src, alt }: { src: StaticImageData; alt: string },
  idx: number
) => (
  <Image
    key={idx}
    src={src}
    alt={alt}
    placeholder="blur"
    // TODO: This "fixes" blurry images in chrome but makes them look considerably worse in Safari
    // See: https://stackoverflow.com/questions/37906602/blurry-downscaled-images-in-chrome
    // style={{ imageRendering: "-webkit-optimize-contrast" }}
  />
);

const images = [
  { src: avanti_menu_item_14, alt: "Poke Stack" },
  { src: avanti_menu_item_15, alt: "Poke Stack" },
  { src: avanti_menu_item_16, alt: "Paloma" },
  { src: avanti_menu_item_17, alt: "Crab Cakes" },
  { src: avanti_menu_item_18, alt: "Ahi Tuna Tartare" },
  { src: avanti_menu_item_19, alt: "Ahi Tuna Tartare" },
  { src: avanti_menu_item_20, alt: "Caprese salad" },
  { src: avanti_menu_item_21, alt: "Amberjack with Mango Salsa" },
  { src: avanti_menu_item_22, alt: "Amberjack with Mango Salsa" },
  { src: avanti_menu_item_23, alt: "Chicken" },
  { src: avanti_menu_item_24, alt: "Coconut Shrimp" },
  { src: avanti_menu_item_25, alt: "Panna Cotta" },
  { src: avanti_menu_item_26, alt: "House Salad" },
  { src: avanti_menu_item_27, alt: "" },
  { src: avanti_menu_item_28, alt: "" },
  { src: avanti_menu_item_29, alt: "" },
  { src: avanti_menu_item_30, alt: "" },
  { src: avanti_menu_item_31, alt: "" },
  { src: avanti_menu_item_32, alt: "" },
  { src: avanti_menu_item_33, alt: "" },
  { src: avanti_menu_item_34, alt: "" },
  { src: avanti_menu_item_35, alt: "" },
  { src: avanti_menu_item_36, alt: "" },
  { src: avanti_menu_item_37, alt: "" },
  { src: avanti_menu_item_38, alt: "" },
].map(mapper);

export default function Gallery() {
  return (
    <>
      <Header title="Some Photos" image="/assets/photos/wine_on_bar.jpg" />
      <Section>
        <Heading heading="Take a Peek" />
        <div className="row">
          <div className="col-12">{/* Carousel goes here */}</div>
        </div>
      </Section>
      <Section>
        <div className="row gx-3">
          <div className="mb-6">
            <Masonry responsive gutter={12} columns={3}>
              {images}
            </Masonry>
          </div>
        </div>
      </Section>
    </>
  );
}
