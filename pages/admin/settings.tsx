import { User } from "@prisma/client";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import prisma from "../../lib/prismadb";

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

type SettingsProps = {
  user: User;
};

const Settings: React.FC<SettingsProps> = ({ user }) => {
  return (
    <div className="row justify-content-center">
      <div className="col">
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

  const user = await prisma.user.findUnique({
    select: {
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      // We know that email can't be null if they're already logged in
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
