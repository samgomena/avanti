import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import type { GetStaticProps } from "next/types";
import { Facebook, Instagram, MapPin } from "react-feather";
import { ParallaxBanner } from "react-scroll-parallax";
import Alerts from "../components/Alerts";
import { useFlag } from "../lib/hooks/useFlags";

const layers = [
  {
    image: "/assets/photos/1.jpg",
    speed: 10,
  },
];

const iconSize = 24;
// TODO: Don't use any
export default function Home({ alerts, info }: any) {
  const { enabled: reservationsEnabled } = useFlag("reservations");

  return (
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

              <Link href="/menu">
                <a className="btn btn-outline-primary text-white text-primary-hover mb-7 mb-md-0 me-2 umami--click--Menu-Button-Clicked">
                  Menu
                </a>
              </Link>

              {reservationsEnabled && (
                <Link href="https://www.opentable.com/r/avanti-reservations-west-linn?restref=1277137&lang=en-US&ot_source=Restaurant%20website">
                  <a
                    className="btn btn-primary text-white text-primary-hover mb-7 mb-md-0 umami--click--OpenTable-Reserve-Clicked"
                    rel="noopener noreferer"
                    target="_blank"
                  >
                    Reserve a Table
                  </a>
                </Link>
              )}
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
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prisma = new PrismaClient();
  const alerts = await prisma.alert.findMany({
    orderBy: {
      start: "desc",
    },
  });
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
