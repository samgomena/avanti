import Layout from "../components/layout";

export default function Contact() {
  return (
    <Layout>
      <>
        <section className="section section_contact">
          <div className="container">
            <div className="row">
              <div className="col">
                <h2 className="section__heading text-center">
                  Get in touch with us
                </h2>

                <p className="section__subheading text-center">
                  Thank you for reaching out. If this is an urgent matter please
                  contact us by phone.
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 order-md-2">
                <div className="col-md-9 order-md-1">
                  <div className="section_contact__info">
                    <div className="section_contact__info__item">
                      <h4 className="section_contact__info__item__heading">
                        Write us
                      </h4>
                      <p className="section_contact__info__item__content">
                        <a href="mailto:avanti.tualatin@gmail.com">
                          avanti.tualatin@gmail.com
                        </a>
                      </p>
                    </div>
                    <div className="section_contact__info__item">
                      <h4 className="section_contact__info__item__heading">
                        Call us
                      </h4>
                      <p className="section_contact__info__item__content">
                        <a href="tel:5038265631">(503)-826-5631</a>
                      </p>
                    </div>
                    <div className="section_contact__info__item">
                      <h4 className="section_contact__info__item__heading">
                        Visit us
                      </h4>
                      <p className="section_contact__info__item__content">
                        <a href="https://goo.gl/maps/FL2HrEncorxU7rZH9">
                          7995 SW Nyberg St, Tualatin, OR 97062
                        </a>
                      </p>
                    </div>
                    <div className="section_contact__info__item">
                      <h4 className="section_contact__info__item__heading">
                        Social
                      </h4>
                      <ul className="section_contact__info__item__content">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section_map">
          <div
            className="section_map__map"
            data-lat="45.3830129"
            data-lng="-122.75848759999997"
            data-zoom="12"
            data-info="<h4 className='section_map__map__heading text-center'>Avanti - Restaurant & Bar</h4><p className='section_map__map__content text-center text-muted'>7995 SW Nyberg St, Tualatin, OR 97062<br>(503)-826-5631</p>"
          ></div>
        </section>
      </>
    </Layout>
  );
}
