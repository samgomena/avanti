import type { GetServerSideProps } from "next/types";

// TODO: It would probably be a good idea to show a message about what adding/editing does and how it can affect the production site
const Menu: React.FC = () => {
  return null;
};

export default Menu;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: false,
      destination: "/admin/menu/add",
    },
  };
};
