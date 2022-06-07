import { useRouter } from "next/router";
import { useFlag } from "../../lib/hooks/useFlags";
import withAdminNav from "../../lib/withAdminNav";

const Info: React.FC = () => {
  const router = useRouter();
  const { enabled } = useFlag("adminPage");

  router.push(enabled ? "/admin/info/edit" : "/");

  return null;
};

export default withAdminNav(Info);
