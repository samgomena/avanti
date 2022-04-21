import { Facebook, Instagram, MapPin } from "react-feather";
import { ParallaxBanner } from "react-scroll-parallax";
import { useFlag } from "../lib/hooks/useFlags";
import useInfo from "../lib/hooks/useInfo";

const layers = [
  {
    image: "/assets/photos/1.jpg",
    amount: 0,
  },
];

const iconSize = 18;
export default function Home() {
  const info = useInfo();
  const { enabled: reservationsEnabled } = useFlag("reservations");

  return (
    <ParallaxBanner layers={layers} className="h-100">
      <div className="d-flex flex-column min-vh-100 bg-black-50 pt-10 pt-md-8 pb-7 pb-md-0 position-relative">
        <div className="container my-auto">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center">
              <h1 className="display-1 text-white mb-4">Avanti</h1>

              <h6 className="text-xs text-white-75">
                <span className="text-primary">Restaurant</span> / Bar
              </h6>

              <p className="text-center text-white-75 mb-7">
                Located in West Linn, Oregon
              </p>

              {reservationsEnabled && (
                <a
                  className="btn btn-outline-primary text-white text-primary-hover mb-7 mb-md-0"
                  href="#reservation"
                >
                  Make a reservation
                </a>
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
                    <Instagram size={iconSize} />
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-md">
              <p className="font-serif text-white-75 text-center text-md-end text-lg-end my-md-5">
                <i className="fas fa-map-marker-alt text-primary me-3"></i>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(
                    info.contact.address
                  )}`}
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
