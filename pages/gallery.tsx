import Image, { StaticImageData } from "next/image";

import Header from "../components/Header";
import Heading from "../components/Heading";
import Masonry from "../components/Masonry/Masonry";
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

const appetizers = [
  { src: coconut_shrimp, alt: "Coconut Shrimp" },
  { src: cheese_plate, alt: "Cheese Plate" },
  { src: ahi_nicoise_salad, alt: "Seared Ahi Nicoise salad" },
  { src: baby_kale_salad, alt: "Baby Kale Salad" },
  { src: caprese, alt: "Caprese Salad" },
  { src: truffled_mushroom_soup, alt: "Truffled Mushroom Soup" },
  { src: creme_brulee, alt: "Creme Brulee" },
].map(mapper);

const mains = [
  { src: pork_chop, alt: "Smoked Double-Cut Pork Chop" },
  { src: grilled_salmon, alt: "Grilled King Salmon" },
  { src: flatiron_steak, alt: "Flatiron Steak" },
  { src: grilled_chicken, alt: "Grilled Chicken Breast" },
  { src: cheese_burger, alt: "Cheese Burger with Fries" },
  { src: fish_and_chips, alt: "Fish and Chips" },
  { src: braised_halibut, alt: "Pan Braised Alaskan Halibut" },
  { src: blt_with_fries, alt: "BLT with Fries" },
  { src: chocolate_souffle, alt: "Chocolate Souffle" },
].map(mapper);

const drinks = [
  { src: bloody_mary, alt: "Blood Mary" },
  { src: grapefruit_drop, alt: "Grapefruit Drop" },
  { src: pouring_wine, alt: "Serving Wine" },
  { src: serving_libation, alt: "Serving a Drink" },
  { src: pineapple_mule, alt: "Pineapple Mule" },
  { src: shirley_temple, alt: "PamaFlower" },
].map(mapper);

export default function Gallery() {
  return (
    <>
      <Header title="Some Photos" image="/assets/photos/wine_on_bar.jpg" />
      <Section>
        <Heading heading="Take a Peek" subHeading="" />
        <div className="row">
          <div className="col-12">{/* Carousel goes here */}</div>
        </div>
      </Section>
      <Section>
        <div className="row gx-3">
          <div className="mb-6">
            <Masonry responsive gutter={14} columns={3}>
              {appetizers}
            </Masonry>
          </div>

          <div className="mb-6">
            <Masonry responsive gutter={14} columns={3}>
              {mains}
            </Masonry>
          </div>

          <div>
            <Masonry responsive gutter={14} columns={3}>
              {drinks}
            </Masonry>
          </div>
        </div>
      </Section>
    </>
  );
}
