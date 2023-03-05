import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import useSWR from "swr";
import { useFlag } from "../../lib/hooks/useFlags";
import fetcher from "../../lib/utils/fetcher";

import withAdminNav from "../../lib/withAdminNav";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const Settings: React.FC = () => {
  const router = useRouter();
  const { enabled } = useFlag("adminPage");

  !enabled && router.push("/");

  const { data: user } = useSWR("/api/user", fetcher);
  console.log(user);
  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="row justify-content-center">
      <div className="col">
        <p>
          <span>Name:</span>{" "}
          <span>
            {user.firstName} {user.lastName}
          </span>
        </p>
        <p>
          <span>Email:</span> <span>{user.email}</span>
        </p>
        <p>
          <span>Permissions:</span> <span>{user.authLevel}</span>
        </p>
        <p>
          <span>Last updated:</span> <span>{formatDate(user.updatedAt)}</span>
        </p>
        <p>
          <span>Created:</span> <span>{formatDate(user.createdAt)}</span>
        </p>
      </div>
    </div>
  );
};

export default withAdminNav(Settings);

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
