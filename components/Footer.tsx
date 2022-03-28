import useInfo from "../lib/hooks/useInfo";
import { HoursPreview } from "../lib/types/info";
import { to12 } from "../lib/utils/utils";

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
            <p className="mb-6">{info.about}</p>
          </div>
          <div className="col-sm-4">
            <h5 className="text-xs text-primary">Contact Info</h5>

            <ul className="list-unstyled mb-6">
              <li className="d-flex mb-2">
                <div className="fas fa-map-marker-alt me-3 mt-2 fs-sm"></div>{" "}
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(
                    info.contact.address
                  )}`}
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

            {info.hoursPreview.map(({ day, open, close }, idx) => (
              <div className="mb-3" key={day}>
                <div className="text-xs">{day}</div>
                {open === null || close === null ? (
                  <div className="font-serif">
                    <em>Closed</em>
                  </div>
                ) : (
                  <div className="font-serif">
                    {to12(open)} - {to12(close)}
                  </div>
                )}
              </div>
            ))}
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
