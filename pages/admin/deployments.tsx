import withAdminNav from "@/lib/withAdminNav";
import type { GetServerSideProps } from "next";
import { getAuthSessionFromGssp } from "@/lib/auth-session";

const Deployments: React.FC = () => {
  return <div>Deployments</div>;
};

export default withAdminNav(Deployments);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getAuthSessionFromGssp(ctx);
  if (!session?.user) {
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
