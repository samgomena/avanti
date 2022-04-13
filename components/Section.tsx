const Section: React.FC<React.HTMLProps<HTMLTableSectionElement>> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <section className={`py-7 py-md-9 ${className}`} {...rest}>
      <div className="container">{children}</div>
    </section>
  );
};

export default Section;
