import useSWR from "swr";
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
