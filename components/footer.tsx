export default function Footer() {
  return (
    <footer className="py-7 py-md-9 bg-black">
      <div className="container px-4">
        <div className="row gx-7">
          <div className="col-sm-4">
            <h5 className="text-xs text-primary">About Us</h5>

            <p className="mb-6">
              We&apos;re a small family owned restaurant located on the corner
              of Nyberg Street and Martinazzi Avenue in Tualatin, Oregon.
            </p>
          </div>
          <div className="col-sm-4">
            <h5 className="text-xs text-primary">Contact Info</h5>

            <ul className="list-unstyled mb-6">
              <li className="d-flex mb-2">
                <div className="fas fa-map-marker-alt me-3 mt-2 fs-sm"></div>{" "}
                <a
                  href="https://goo.gl/maps/K6R19AyT4Cz"
                  target="_blank"
                  rel="noreferrer"
                >
                  7995 SW Nyberg St, Tualatin, OR 97062
                </a>
              </li>
              <li className="d-flex mb-2">
                <div className="fas fa-phone me-3 mt-2 fs-sm"></div>{" "}
                <a href="tel:5038265631">(503)-826-5631</a>
              </li>
              <li className="d-flex">
                <div className="far fa-envelope me-3 mt-2 fs-sm"></div>{" "}
                <a href="mailto:avanti.tualatin@gmail.com">
                  avanti.tualatin@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <div className="col-sm-4">
            <h5 className="text-xs text-primary">Hours</h5>

            <div className="mb-3">
              <div className="text-xs">Tuesday - Sunday</div>
              <div className="font-serif">4:00 PM - 9:00 PM</div>
            </div>

            {/* <div className="mb-6">
              <div className="text-xs">Friday - Sunday</div>
              <div className="font-serif">12:00 AM - 03:00 AM</div>
            </div> */}
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-sm-center align-items-start">
              <hr className="hr-sm me-3" style={{ height: "1px" }} /> Copyright
              &copy; &nbsp;
              {new Date().getFullYear()}&nbsp;Avanti, Inc. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
