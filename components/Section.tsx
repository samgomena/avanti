type Props = {
  className?: string;
};

const Section: React.FC<Props> = ({ children, className = "" }) => {
  return (
    <section className={`py-7 py-md-9 ${className}`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 text-center"></div>
        </div>
        {children}
      </div>
    </section>
  );
};

export default Section;
