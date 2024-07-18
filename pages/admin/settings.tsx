import type { User } from "@prisma/client";
import { getSession } from "next-auth/react";
import type { GetServerSideProps } from "next/types";
import { db } from "@/server/db";
import { formatDate } from "../../lib/utils/utils";

import withAdminNav from "../../lib/withAdminNav";

type SettingsProps = {
  user: User;
};

const Settings: React.FC<SettingsProps> = ({ user }) => {
  return (
    <div className="row justify-content-center">
      <div className="col">
        <div className="col-3 col-md-8 col-lg-9">
          <h3 data-testid="title">Settings</h3>
        </div>

        <p>
          <span>Name: {user.name}</span>
        </p>
        <p>
          <span>Email: {user.email}</span>
        </p>
        <p>
          <span>
            Last updated: {formatDate(user.updatedAt as unknown as string)}
          </span>
        </p>
        <p>
          <span>
            Created: {formatDate(user.createdAt as unknown as string)}
          </span>
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

  const user = await db.user.findUnique({
    select: {
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      // biome-ignore lint/style/noNonNullAssertion: We know that email can't be null if they're already logged in
      email: session.user?.email!,
    },
  });

  return {
    props: {
      user: {
        ...user,
        createdAt: user?.createdAt.toISOString(),
        updatedAt: user?.updatedAt.toISOString(),
      },
    },
  };
};
