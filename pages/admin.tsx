import { useRouter } from "next/router";
import useUser from "../lib/hooks/useUser";
import useFlags from "../lib/hooks/useFlags";
import { useEffect } from "react";

const Admin: React.FC = () => {
  const { adminPage } = useFlags();

  // @ts-ignore
  // const { user } = useUser({ redirectTo: "/login" });

  const router = useRouter();
  useEffect(() => {
    // Default to overview if no route selected
    router.push(adminPage ? "/admin/overview" : "/");
  }, [adminPage, router]);

  return null;
};

export default Admin;
