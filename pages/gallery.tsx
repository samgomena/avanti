import Header from "../components/Header";

export default function Gallery() {
  return (
    <>
      <Header title="Some Photos" />
      <section className="pt-7 pt-md-9">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center">
              <h2 className="mb-2">Take a Peek</h2>

              <p className="mb-6">Lots of activity here...</p>
            </div>
          </div>

          <div className="row">
            <div className="col-12">{/* Carousel goes here */}</div>
          </div>
        </div>
      </section>

      <section className="py-7 py-md-9">
        <div className="container">
          <div className="row gx-3"></div>
        </div>
      </section>
    </>
  );
}
