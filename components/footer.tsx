export default function Footer() {
  return (
    <footer className="section section_footer">
      <div className="container">
        <div className="row">
          <div className="col-sm-4">
            <h5 className="section_footer__heading">About Us</h5>
            <p>
              We're a small family owned restaurant located on the corner of
              Nyberg Street and Martinazzi Avenue in Tualatin, Oregon.
            </p>
          </div>
          <div className="col-sm-4">
            <h5 className="section_footer__heading">Contact info</h5>
            <ul className="section_footer__info">
              <li>
                <i className="fa fa-map-marker"></i>
                <a href="https://goo.gl/maps/K6R19AyT4Cz" target="_blank">
                  7995 SW Nyberg St, Tualatin, OR 97062
                </a>
              </li>
              <li>
                <i className="fa fa-phone"></i>
                <a href="tel:5038265631">(503)-826-5631</a>
              </li>
              <li>
                <i className="fa fa-envelope-o"></i>
                <a href="mailto:avanti.tualatin@gmail.com">
                  avanti.tualatin@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <div className="col-sm-4">
            <h5 className="section_footer__heading">Hours</h5>
            <div className="section_footer__open">
              <div className="section_footer__open__days">
                Tuesday - Thursday
              </div>
              <div className="section_footer__open__time">
                11:00 AM - 9:00 PM
              </div>
              <div className="small">Happy Hour: 3:00 PM - 5:00 PM</div>
            </div>
            <div className="section_footer__open">
              <div className="section_footer__open__days">
                Friday - Saturday
              </div>
              <div className="section_footer__open__time">
                11:00 AM - 10:00 PM
              </div>
              <div className="small">
                Happy Hour: 3:00 PM - 5:00 PM &amp; 9:00 PM - Close
              </div>
            </div>
            <div className="section_footer__open">
              <div className="section_footer__open__days">Sunday</div>
              <div className="section_footer__open__time">
                5:00 PM - 9:00 PM
              </div>
            </div>
            <br />
            <h5 className="section_footer__heading">
              Seasonal Closures and Opening
            </h5>
            <div className="section_footer__open">
              <div className="section_footer__open__time">
                Christmas Eve - Closed
              </div>
              <div className="section_footer__open__time">
                Christmas Day - Closed
              </div>
              <div className="section_footer__open__time">
                New Year's Eve - Open for Dinner at 4:00 PM
              </div>
              <div className="section_footer__open__time">
                New Year's Day - Closed
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="section_footer__copyright">
              <i className="fa fa-copyright"></i>
              <span>{new Date().getFullYear()}</span> Avanti. All rights
              reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
