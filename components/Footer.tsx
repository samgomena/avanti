import useInfo from "../lib/hooks/useInfo";

const formatPhone = (number: string) => {
  const area = number.slice(0, 3);
  const middle = number.slice(3, 6);
  const end = number.slice(6);
  return `(${area})-${middle}-${end}`;
};

export default function Footer() {
  const info = useInfo();
  return (
    <footer className="py-7 py-md-9 bg-black">
      <div className="container px-4">
        <div className="row gx-7">
          <div className="col-sm-4">
            <h5 className="text-xs text-primary">About Us</h5>

            {/* <p className="mb-6">
              We&apos;re a small family owned restaurant located on the corner
              of Nyberg Street and Martinazzi Avenue in Tualatin, Oregon.
            </p> */}
            <p className="mb-6">{info.about}</p>
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
                  {info.contact.address}
                </a>
              </li>
              <li className="d-flex mb-2">
                <div className="fas fa-phone me-3 mt-2 fs-sm"></div>{" "}
                <a href={`tel:${info.contact.phone}`}>
                  {formatPhone(info.contact.phone)}
                </a>
              </li>
              <li className="d-flex">
                <div className="far fa-envelope me-3 mt-2 fs-sm"></div>{" "}
                <a href={`mailto:${info.contact.email}`}>
                  {info.contact.email}
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
