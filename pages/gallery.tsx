import Header from "../components/Header";
import Heading from "../components/Heading";
import Section from "../components/Section";

export default function Gallery() {
  return (
    <>
      <Header title="Some Photos" image="/assets/photos/wine_on_bar.jpg" />
      <Section>
        <Heading heading="Take a Peek" subHeading="Lots of activity here..." />
        <div className="row">
          <div className="col-12">{/* Carousel goes here */}</div>
        </div>
      </Section>
      <Section>
        <div className="row gx-3">{/* Photos go here */}</div>
      </Section>
    </>
  );
}
