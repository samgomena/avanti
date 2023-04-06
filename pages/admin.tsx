import type { GetServerSideProps } from "next/types";

const Admin: React.FC = () => {
  return null;
};

export default Admin;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: false,
      destination: "/admin/overview",
    },
  };
};
