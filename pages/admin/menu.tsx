import { useRouter } from "next/router";
import { useEffect } from "react";
import useFlags from "../../lib/hooks/useFlags";
import withAdminNav from "../../lib/withAdminNav";

// TODO: It would probably be a good idea to show a message about what adding/editing does and how it can affect the production site
const Menu: React.FC = () => {
  const router = useRouter();
  const { adminPage } = useFlags();

  useEffect(() => {
    // Default to adding items for now
    router.push(adminPage ? "/admin/menu/add" : "/");
  }, [adminPage, router]);

  return null;
};

export default withAdminNav(Menu);
