import { PrismaClient, type Alert } from "@prisma/client";
import Link from "next/link";
import type { GetStaticProps } from "next/types";
import { Facebook, Instagram, MapPin } from "react-feather";
import { ParallaxBanner } from "react-scroll-parallax";
import type { BannerLayer } from "react-scroll-parallax/dist/components/ParallaxBanner/types";
import Alerts from "../components/Alerts";
// import Carousel from "react-bootstrap/Carousel";

const gradientOverlay: BannerLayer = {
  opacity: [0, 0.95],
  shouldAlwaysCompleteAnimation: true,
  expanded: true,
  children: (
    <div
      style={{
        position: "absolute",
        inset: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "#111827",
      }}
    />
  ),
};

const layers = [
  {
    image: "/assets/photos/avanti_restaurant_5.jpg",
    speed: 12,
  },
  gradientOverlay,
];

type Info = {
  contact: {
    address: string;
    facebook: string;
    instagram: string;
  };
};

const iconSize = 24;
export default function Home({
  alerts,
  info,
}: {
  alerts: Alert[];
  info: Info;
}) {
  return (
    <>
      <ParallaxBanner layers={layers} className="h-100">
        <div className="d-flex flex-column min-vh-100 bg-black-50 pt-10 pt-md-8 pb-7 pb-md-0 position-relative">
          <div className="container my-auto">
            <div className="row justify-content-center">
              <div className="col-12 col-md-8 col-lg-6 text-center">
                <Alerts alerts={alerts} />
                <h1 className="display-1 text-white mb-4">Avanti</h1>

                <h2 className="text-xs text-white-75">
                  <span className="text-primary">Restaurant</span> / Bar
                </h2>

                <p className="text-center text-white-75 mb-7">
                  Located in West Linn, Oregon
                </p>

                <Link
                  href="/menu"
                  className="btn btn-outline-primary text-white text-primary-hover mb-7 mb-md-0 me-2"
                  data-umami-event="Menu-Button-Clicked"
                >
                  Menu
                </Link>

                <Link
                  href="https://www.opentable.com/r/avanti-reservations-west-linn?restref=1277137&lang=en-US&ot_source=Restaurant%20website"
                  className="btn btn-primary text-white text-primary-hover mb-7 mb-md-0"
                  data-umami-event="OpenTable-Reserve-Clicked"
                  rel="noopener noreferer"
                  target="_blank"
                >
                  Reserve a Table
                </Link>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-md">
                <ul className="list-inline text-center text-md-start mb-3 my-md-5">
                  <li className="list-inline-item">
                    <a
                      href={info.contact.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white-75 text-primary-hover"
                    >
                      <span className="visually-hidden">Facebook</span>
                      <Facebook size={iconSize} />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a
                      href={info.contact.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white-75 text-primary-hover"
                    >
                      <span className="visually-hidden">Instagram</span>
                      <Instagram size={iconSize} />
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-md">
                <p className="font-serif text-white-75 text-center text-md-end text-lg-end my-md-5">
                  <i className="fas fa-map-marker-alt text-primary me-3"></i>
                  <a
                    href="https://goo.gl/maps/rgDVKbs6SsXyUxiU9"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white-75 text-primary-hover"
                  >
                    <MapPin className="me-2 mb-2" size={18} />
                    {info.contact.address}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </ParallaxBanner>
      {/* <section className="bg-light" style={{ height: "30rem" }}>
        <Carousel fade>
          <Carousel.Item>
            <Image src="https://placehold.co/600x400" alt="" layout="fill" />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <Image src="https://placehold.co/600x400" alt="" layout="fill" />
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <Image src="https://placehold.co/600x400" alt="" layout="fill" />
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </section> */}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prisma = new PrismaClient();
  const alerts = await prisma.alert.findMany({
    orderBy: {
      start: "desc",
    },
  });
  // TODO: These need to be loaded not statically probably lol whoops
  const _alerts = alerts?.map((alert) => ({
    ...alert,
    start: alert.start.toISOString(),
    end: alert.end.toISOString(),
  }));

  const contact = await prisma.contact.findFirst({
    select: {
      address: true,
      facebook: true,
      instagram: true,
    },
  });

  return {
    props: { alerts: _alerts, info: { contact } },
  };
};
