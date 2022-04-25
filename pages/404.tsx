import Link from "next/link";
import Button from "react-bootstrap/Button";
import Header from "../components/Header";
import Section from "../components/Section";

const FourOhFour: React.FC = () => {
  return (
    <>
      <Header title="There's nothing here!" image="" />
      <Section>
        <div className="row justify-content-center">
          <div className="col d-flex justify-content-center">
            <Button variant="outline-primary">
              <Link href="/">Go back home</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
};

export default FourOhFour;
