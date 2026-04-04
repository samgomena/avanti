import { getAuthSessionFromGssp } from "@/lib/auth-session";
import { drizzleDb } from "@/lib/db/libsql";
import { user as userTable } from "@/lib/db/schema";
import type { GetServerSideProps } from "next/types";
import { eq } from "drizzle-orm";
import { formatDate } from "../../lib/utils/utils";

import withAdminNav from "../../lib/withAdminNav";

type SettingsProps = {
  user: {
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
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
          <span>Last updated: {formatDate(user.updatedAt)}</span>
        </p>
        <p>
          <span>Created: {formatDate(user.createdAt)}</span>
        </p>
      </div>
    </div>
  );
};

export default withAdminNav(Settings);

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

  const [row] = await drizzleDb
    .select({
      email: userTable.email,
      name: userTable.name,
      createdAt: userTable.createdAt,
      updatedAt: userTable.updatedAt,
    })
    .from(userTable)
    .where(eq(userTable.id, session.user.id))
    .limit(1);

  if (!row) {
    return {
      redirect: {
        permanent: false,
        destination: `/login?wantsUrl=${ctx.resolvedUrl}`,
      },
    };
  }

  return {
    props: {
      user: {
        email: row.email,
        name: row.name,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      },
    },
  };
};
