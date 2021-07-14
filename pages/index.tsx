import { ParallaxBanner } from "react-scroll-parallax";

export default function Home() {
  // TODO
  const layers = [
    {
      image: "",
      amount: 0.8,
    },
  ];
  return (
    <ParallaxBanner layers={layers} style={{ height: "100vh" }}>
      <div className="d-flex flex-column min-vh-100 bg-black-50 pt-10 pt-md-8 pb-7 pb-md-0">
        <div className="container my-auto">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center">
              <h1 className="display-1 text-white mb-4">Avanti</h1>

              <h6 className="text-xs text-white-75">
                <span className="text-primary">Restaurant</span> / Bar
              </h6>

              <p className="text-center text-white-75 mb-7">
                Located in Tualatin, Oregon
              </p>

              {/* <a
                className="btn btn-outline-primary text-white text-primary-hover mb-7 mb-md-0"
                href="#reservation"
              >
                Make reservation
              </a> */}
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md">
              <ul className="list-inline text-center text-md-start mb-3 my-md-5">
                {Object.entries({ facebook: "", instagram: "" }).map(
                  ([socialName, link], idx) => (
                    <li className="list-inline-item" key={idx}>
                      <a
                        href={link}
                        className="text-white-75 text-primary-hover"
                      >
                        <i className={`fab fa-${socialName}`}></i>
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="col-md">
              <p className="font-serif text-white-75 text-center text-md-end text-lg-end my-md-5">
                <i className="fas fa-map-marker-alt text-primary me-3"></i>
                <a href="https://goo.gl/maps/K6R19AyT4Cz" target="_blank">
                  7995 SW Nyberg St, Tualatin, OR 97062
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ParallaxBanner>
  );
}
