import React from "react";
import { ParallaxBanner } from "react-scroll-parallax";

type HeaderProps = { title: string; image?: string };

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  children,
  title,
  image = "",
}) => {
  image = image.startsWith("/assets/photos/")
    ? image
    : `/assets/photos/${image}`;
  const layers = [{ image, speed: -10 }];
  return (
    <ParallaxBanner layers={layers}>
      <div className="py-12 py-md-15 bg-black-50 position-relative">
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

export const AdminHeader: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return <div className="py-6 bg-black position-relative">{children}</div>;
};

export default Header;
