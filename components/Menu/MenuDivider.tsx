import { PropsWithChildren } from "react";

const MenuDivider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="d-flex justify-center items-center my-4">
      <hr style={{ flex: 1 }} />
      <span className="navbar-brand fs-4 mx-4">{children}</span>
      <hr style={{ flex: 1 }} />
    </div>
  );
};

export default MenuDivider;
