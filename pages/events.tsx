import Link from "next/link";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Section from "../components/Section";

export default function Events() {
  return (
    <>
      <Header title="Special Events" image="glasses_on_shelf.jpg" />
      <Section>
        <Heading
          heading="Upcoming Events"
          subHeading="Avanti is a perfect place for celebrating family and corporate events!"
        />
        <div className="row">
          <div className="col-12">
            <p>
              If you would like to schedule a private event, please
              <Link href="/contact"> contact us</Link>.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
