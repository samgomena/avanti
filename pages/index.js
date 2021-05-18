import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{" "}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
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
