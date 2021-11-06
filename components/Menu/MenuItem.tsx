type Props = {
  name: string;
  description: string;
  price?: number;
};

const MenuItem: React.FC<Props> = ({ name, description, price }) => {
  return (
    <div className="col-12 col-md-6">
      <div className="py-3 border-bottom">
        <div className="row">
          {/* Image would go in here */}
          {/* <div className="col-3 align-self-center"></div> */}
          {/* Instead use this as a placeholder */}
          <div className="col-md-3 col-1"></div>
          <div className="col-7">
            <h5 className="mb-2">{name}</h5>
            <p className="mb-0">{description}</p>
          </div>
          <div className="col-md-2 col-3">
            <div className="fs-4 font-serif text-center text-black">
              ${price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
