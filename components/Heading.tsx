type Props = {
  heading: string;
  subHeading?: string;
};

const Heading: React.FC<Props> = ({ heading, subHeading = "" }) => {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6 text-center">
        <h2 className="mb-2">{heading}</h2>
        {subHeading !== "" && <p className="mb-6">{subHeading}</p>}
      </div>
    </div>
  );
};

export default Heading;
