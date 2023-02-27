import type { GetStaticProps } from "next";

const Info: React.FC = () => {
  return null;
};

export default Info;

export const getStaticProps: GetStaticProps = () => {
  return {
    redirect: {
      permanent: false,
      destination: "/admin/info/edit",
    },
  };
};
