import React from "react";

type Props = { title: string };

const Header: React.FC<Props> = ({ children, title }) => {
  return (
    <header data-jarallax data-speed=".8">
      <div className="pt-10 pb-8 pt-md-15 pb-md-13 bg-black-50">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center">
              <h1 className="display-6 fw-bold text-white">{title}</h1>
              {children}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
