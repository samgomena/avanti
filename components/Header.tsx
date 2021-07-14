import React from "react";
import { ParallaxBanner } from "react-scroll-parallax";

type Props = { title: string; image?: string };

const Header: React.FC<Props> = ({ children, title, image = "" }) => {
  const layers = [{ image, amount: 0.5 }];
  return (
    <ParallaxBanner layers={layers}>
      <div className="pt-10 pb-8 pt-md-15 pb-md-13 bg-black-50 position-relative">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center">
              <h1 className="display-6 fw-bold text-white">{title}</h1>
              {children}
            </div>
          </div>
        </div>
      </div>
    </ParallaxBanner>
  );
};

export default Header;
