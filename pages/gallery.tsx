import dynamic from "next/dynamic";
import Image, { StaticImageData } from "next/image";

import Header from "../components/Header";
import Heading from "../components/Heading";
import Section from "../components/Section";

import avanti_menu_item_14 from "../public/assets/photos/avanti_menu_item_14.jpg";
import avanti_menu_item_15 from "../public/assets/photos/avanti_menu_item_15.jpg";
import avanti_menu_item_16 from "../public/assets/photos/avanti_menu_item_16.jpg";
import avanti_menu_item_17 from "../public/assets/photos/avanti_menu_item_17.jpg";
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
import avanti_menu_item_40 from "../public/assets/photos/avanti_menu_item_40.jpg";
import avanti_menu_item_41 from "../public/assets/photos/avanti_menu_item_41.jpg";
import avanti_menu_item_42 from "../public/assets/photos/avanti_menu_item_42.jpg";
import avanti_menu_item_44 from "../public/assets/photos/avanti_menu_item_44.jpg";
import avanti_menu_item_45 from "../public/assets/photos/avanti_menu_item_45.jpg";
import avanti_menu_item_47 from "../public/assets/photos/avanti_menu_item_47.jpg";
import avanti_menu_item_52 from "../public/assets/photos/avanti_menu_item_52.jpg";
import avanti_menu_item_53 from "../public/assets/photos/avanti_menu_item_53.jpg";

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
  { src: avanti_menu_item_19, alt: "Ahi Tuna Tartare" },
  { src: avanti_menu_item_20, alt: "Caprese salad" },
  { src: avanti_menu_item_21, alt: "Amberjack with Mango Salsa Special" },
  { src: avanti_menu_item_22, alt: "Amberjack with Mango Salsa Special" },
  { src: avanti_menu_item_23, alt: "Pan Roasted Chicken Breast" },
  { src: avanti_menu_item_24, alt: "Coconut Shrimp" },
  { src: avanti_menu_item_25, alt: "Panna Cotta" },
  { src: avanti_menu_item_26, alt: "House Salad" },
  { src: avanti_menu_item_27, alt: "Steak" },
  { src: avanti_menu_item_28, alt: "Braised Alaskan Halibut" },
  { src: avanti_menu_item_29, alt: "Panko and Herb-Crusted Mahi Mahi" },
  { src: avanti_menu_item_30, alt: "Braised Short Ribs" },
  { src: avanti_menu_item_31, alt: "Penne Bolonese Special" },
  { src: avanti_menu_item_32, alt: "Tillamook Cheddar Cheeseburger" },
  { src: avanti_menu_item_33, alt: "Shigoku Oysters Served on the Half Shell" },
  { src: avanti_menu_item_34, alt: "Ice Cream Sandwhich" },
  { src: avanti_menu_item_35, alt: "Flat Iron Steak" },
  { src: avanti_menu_item_36, alt: "Fallen Chocolate Soufflé" },
  { src: avanti_menu_item_37, alt: "Crème Fraîche Cheesecake" },
  { src: avanti_menu_item_38, alt: "Crab Cakes" },
  { src: avanti_menu_item_41, alt: "Roasted Beet and Arugula Salad" },
  { src: avanti_menu_item_40, alt: "Roasted Beet and Arugula Salad" },
  { src: avanti_menu_item_42, alt: "Smoked Pork Chop" },
  { src: avanti_menu_item_44, alt: "Pan Seared Diver Scallops" },
  { src: avanti_menu_item_45, alt: "Pan Seared Diver Scallops" },
  { src: avanti_menu_item_47, alt: "Cheese Board" },
  { src: avanti_menu_item_52, alt: "Fried Calamari" },
  { src: avanti_menu_item_53, alt: "Lemon Drop" },
].map(mapper);

export default function Gallery() {
  return (
    <>
      <Header
        title="Some Photos"
        image="/assets/photos/avanti_menu_item_18.jpg"
      />
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
