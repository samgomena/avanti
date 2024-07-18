import withAdminNav from "@/lib/withAdminNav";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

const Deployments: React.FC = () => {
  return <div>Deployments</div>;
};

export default withAdminNav(Deployments);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: `/login?wantsUrl=${ctx.resolvedUrl}`,
      },
    };
  }

  return {
    props: {},
  };
};
