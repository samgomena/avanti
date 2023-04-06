import { Contact as ContactType, PrismaClient } from "@prisma/client";
import { GetStaticProps } from "next";
import { Facebook, Instagram } from "react-feather";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Section from "../components/Section";
import { formatPhone } from "../lib/utils/utils";

type ContactProps = {
  info: {
    contact: Omit<ContactType, "id">;
  };
};

export default function Contact({ info }: ContactProps) {
  return (
    <>
      <Header
        title="Contact Us"
        image="/assets/photos/avanti_business_logo.jpg"
      />
      <Section>
        <Heading
          heading="Get in Touch!"
          subHeading="Thanks for reaching out! If this is an urgent matter, please contact us by phone."
        />
        <div className="row">
          <div className="col-md-3 order-md-2">
            <h4 className="mb-2 text-xs">Write us</h4>
            <p className="mb-4 font-serif">
              <a href={`mailto:${info.contact.email}`}>{info.contact.email}</a>
            </p>

            <h4 className="mb-2 text-xs">Call us</h4>
            <p className="mb-4 font-serif">
              <a href={`tel:${info.contact.phone}`}>
                {formatPhone(info.contact.phone)}
              </a>
            </p>

            <h4 className="mb-2 text-xs">Visit us</h4>
            <p className="mb-4 font-serif">
              <a
                href="https://goo.gl/maps/rgDVKbs6SsXyUxiU9"
                target="_blank"
                rel="noreferrer"
              >
                {info.contact.address}
              </a>
            </p>

            <h4 className="mb-4 text-xs">Social</h4>
            <p className="mb-4 font-serif">
              <a
                href={info.contact.facebook}
                target="_blank"
                rel="noreferrer"
                title="facebook"
              >
                <Facebook />
              </a>
              <a
                href={info.contact.instagram}
                target="_blank"
                rel="noreferrer"
                className="ms-2"
                title="instagram"
              >
                <Instagram />
              </a>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prisma = new PrismaClient();
  const info = await prisma.info.findFirst({
    select: {
      contact: true,
    },
  });

  return {
    props: {
      info,
    },
  };
};
