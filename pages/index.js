import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section
        class="section section_welcome"
        data-parallax="scroll"
        data-image-src="assets/img/1.jpg"
      >
        <div class="section_welcome__main">
          <div class="container">
            <div class="row align-items-center">
              <div class="col">
                <div
                  class="alert alert-warning alert-dismissible fade show text-center section__subheading"
                  role="alert"
                >
                  We are open for table service from 4 - 9 PM!
                  <hr />
                  For to-go orders please see our
                  <a href="menu.html" class="alert-link">
                    to go menu
                  </a>
                  . Or,
                  <a class="alert-link" href="tel:5038265631">
                    call us!
                  </a>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="alert"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <h1 class="section__heading section_welcome__heading text-center">
                  Avanti
                  <br />
                </h1>
                <h2 class="section__preheading section_welcome__preheading text-center text-muted">
                  <span class="text-primary">Restaurant and Bar</span>
                </h2>
                <p class="section__subheading section_welcome__subheading text-center text-muted">
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
        <div class="section_welcome__footer">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-md">
                <ul class="section_welcome__footer__social text-center text-lg-left">
                  <li>
                    <a href="https://www.facebook.com/pg/avanti.tualatin">
                      <i class="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/avanti_restaurant/">
                      <i class="fa fa-instagram"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-md">
                <div class="section_welcome__footer__address text-center text-lg-right">
                  <i class="fa fa-map-marker"></i>
                  <a href="https://goo.gl/maps/K6R19AyT4Cz" target="_blank">
                    7995 SW Nyberg St, Tualatin, OR 97062
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
