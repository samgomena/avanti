import { useRouter } from "next/router";
import { useFlag } from "../../lib/hooks/useFlags";
import withAdminNav from "../../lib/withAdminNav";

// TODO: It would probably be a good idea to show a message about what adding/editing does and how it can affect the production site
const Menu: React.FC = () => {
  const router = useRouter();
  const { enabled } = useFlag("adminPage");

  router.push(enabled ? "/admin/menu/add" : "/");

  return null;
};

export default withAdminNav(Menu);
