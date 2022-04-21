type MenuItemWrapperProps = {
  children: React.ReactNode;
};

const MenuItemWrapper: React.FC<MenuItemWrapperProps> = ({ children }) => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="row">{children}</div>
      </div>
    </div>
  );
};

export default MenuItemWrapper;
