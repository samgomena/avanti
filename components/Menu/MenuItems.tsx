type MenuItemsProps = {
  children: React.ReactNode;
};

const MenuItems: React.FC<MenuItemsProps> = ({ children }) => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="row">{children}</div>
      </div>
    </div>
  );
};

export default MenuItems;
