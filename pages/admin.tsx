import type { GetStaticProps } from "next/types";

const Admin: React.FC = () => {
  return null;
};

export default Admin;

export const getStaticProps: GetStaticProps = () => {
  return {
    redirect: {
      permanent: false,
      destination: "/admin/overview",
    },
  };
};
