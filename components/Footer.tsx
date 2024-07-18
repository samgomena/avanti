import { useMemo } from "react";
import { Mail, MapPin, Phone } from "react-feather";
import useInfo from "../lib/hooks/useInfo";
import { compactHours, formatPhone, to12 } from "../lib/utils/utils";

export default function Footer() {
  const info = useInfo();
  const compactedHours = useMemo(() => compactHours(info.hours), [info.hours]);
  return (
    <footer className="py-7 py-md-9 bg-black">
      <div className="container px-4">
        <div className="row gx-7">
          <div className="col-sm-4">
            <h3 className="text-xs text-primary">About Us</h3>
            <p className="mb-6">{info.about}</p>
          </div>
          <div className="col-sm-4">
            <h3 className="text-xs text-primary">Contact Info</h3>

            <ul className="list-unstyled mb-6">
              <li className="d-flex mb-2">
                <div className="me-3 mt-2 fs-sm">
                  <MapPin size={16} />
                </div>
                <a
                  href="https://goo.gl/maps/rgDVKbs6SsXyUxiU9"
                  target="_blank"
                  rel="noreferrer"
                >
                  {info.contact.address}
                </a>
              </li>
              <li className="d-flex mb-2">
                <div className="me-3 fs-sm">
                  <Phone size={16} />
                </div>
                <a href={`tel:${info.contact.phone}`}>
                  {formatPhone(info.contact.phone)}
                </a>
              </li>
              <li className="d-flex">
                <div className="me-3 fs-sm">
                  <Mail size={16} />
                </div>
                <a
                  className="text-truncate"
                  href={`mailto:${info.contact.email}`}
                >
                  {info.contact.email}
                </a>
              </li>
            </ul>
          </div>
          <div className="col-sm-4">
            <h3 className="text-xs text-primary">Hours</h3>
            {compactedHours.map((entry, idx) => (
              <div className="mb-3" key={entry.idx}>
                <div className="text-xs">
                  {/* Show single day if it's not a "range" otherwise show `day1 - dayN` */}
                  {entry[0].day === entry.at(-1)?.day
                    ? entry[0].day
                    : `${entry[0].day} - ${entry.at(-1)?.day}`}
                </div>
                {entry[0].open === "" && entry[0].close === "" ? (
                  <div className="font-serif">
                    <em>Closed</em>
                  </div>
                ) : (
                  <div className="font-serif">
                    {to12(entry[0].open)} - {to12(entry[0].close)}
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
              {new Date().getFullYear()}&nbsp;Avanti, LLC. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
