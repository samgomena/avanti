import Head from "next/head";
import Link from "next/link";
import { siteTitle } from "../components/layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section
        className="section section_welcome"
        data-parallax="scroll"
        data-image-src="assets/img/1.jpg"
      >
        <div className="section_welcome__main">
          <div className="container">
            <div className="row align-items-center">
              <div className="col">
                <div
                  className="alert alert-warning alert-dismissible fade show text-center section__subheading"
                  role="alert"
                >
                  We are open for table service from 4 - 9 PM!
                  <hr />
                  For to-go orders please see our
                  <Link href="/menu">
                    <a className="alert-link">to go menu</a>
                  </Link>
                  . Or,
                  <a className="alert-link" href="tel:5038265631">
                    call us!
                  </a>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <h1 className="section__heading section_welcome__heading text-center">
                  Avanti
                  <br />
                </h1>
                <h2 className="section__preheading section_welcome__preheading text-center text-muted">
                  <span className="text-primary">Restaurant and Bar</span>
                </h2>
                <p className="section__subheading section_welcome__subheading text-center text-muted">
                  Located in Tualatin, Oregon.
                </p>
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="section_welcome__footer">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md">
                <ul className="section_welcome__footer__social text-center text-lg-left">
                  <li>
                    <a href="https://www.facebook.com/pg/avanti.tualatin">
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/avanti_restaurant/">
                      <i className="fa fa-instagram"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-md">
                <div className="section_welcome__footer__address text-center text-lg-right">
                  <i className="fa fa-map-marker"></i>
                  <a href="https://goo.gl/maps/K6R19AyT4Cz" target="_blank">
                    7995 SW Nyberg St, Tualatin, OR 97062
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
