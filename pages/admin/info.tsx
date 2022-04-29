import { useRouter } from "next/router";
import { useEffect } from "react";
import useFlags from "../../lib/hooks/useFlags";
import withAdminNav from "../../lib/withAdminNav";

const Info: React.FC = () => {
  const router = useRouter();
  const { adminPage } = useFlags();

  useEffect(() => {
    // Default to adding items for now
    router.push(adminPage ? "/admin/info/edit" : "/");
  }, [adminPage, router]);

  return null;
};

export default withAdminNav(Info);
