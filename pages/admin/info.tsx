import type { GetServerSideProps } from "next/types";

const Info: React.FC = () => {
  return null;
};

export default Info;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: false,
      destination: "/admin/info/edit",
    },
  };
};
