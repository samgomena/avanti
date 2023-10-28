import Link from "next/link";
import Button from "react-bootstrap/Button";
import Header from "../components/Header";
import Section from "../components/Section";
import Heading from "../components/Heading";

const FourOhFour: React.FC = () => {
  return (
    <>
      <Header
        title="Whoops! There's nothing here..."
        image="avanti_restaurant_2.jpg"
      />
      <Section>
        <Heading heading="Terribly sorry about that." />
        <div className="row justify-content-center">
          <div className="col d-flex justify-content-center">
            <Button variant="outline-primary" className="mt-4">
              <Link href="/">Go back home?</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
};

export default FourOhFour;
