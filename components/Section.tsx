type Props = {
  className?: string;
};

const Section: React.FC<Props> = ({ children, className = "" }) => {
  return (
    <section className={`py-7 py-md-9 ${className}`}>
      <div className="container">{children}</div>
    </section>
  );
};

export default Section;
