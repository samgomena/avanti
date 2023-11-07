import dynamic from "next/dynamic";
import Image from "next/image";

import Header from "../components/Header";
import Heading from "../components/Heading";
import Section from "../components/Section";

import jeanneSignature from "../public/assets/photos/jeanne_signature.png";
import markSignature from "../public/assets/photos/mark_signature.png";

// Disabled SSR via dynamic import because Map imports leaflet which interacts with `window` on load
// See: https://stackoverflow.com/a/68183906/4668680
const Map = dynamic(() => import("../components/Map/Map"), { ssr: false });

export default function About() {
  return (
    <>
      <Header
        title="About Us"
        image="/assets/photos/avanti_restaurant_14.jpg"
      />
      <Section>
        <Heading heading="Behind the Scenes" />
        <p>
          Welcome to Avanti - Restaurant & bar. Avanti is the passion project of
          owners Mark Carruth and Jeanne Schneider who after working tirelessly
          for other enitites decided to channel their efforts toward something
          of their own.
        </p>
        <p>
          After initially opening in Tualatin, Oregon in 2018, the restaurant
          was forced to close due to the Coronavirus Pandemic. Soon after, plans
          began to relocate and Avanti was set to reopen in West Linn, Oregon
          just off the 10th street exit.
        </p>
        <p>
          We bring Avanti to you, humbly, and hope that you like it just as much
          as we do.
        </p>
        <p>
          <Image
            src={jeanneSignature}
            alt="Jeanne Schneider's signature"
            width={160}
            height={32.5}
          />
        </p>
        <p>
          <Image
            src={markSignature}
            alt="Mark Carruth's signature"
            width={261}
            height={32.5}
          />
        </p>
        <p>&mdash; Jeanne Schneider and Mark Carruth, Owners and Operators</p>
      </Section>
      <section className="bg-light" style={{ height: "30rem" }}>
        <Map />
      </section>
    </>
  );
}
