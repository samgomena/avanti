import { useRouter } from "next/router";
import useUser from "../lib/useUser";

const Admin: React.FC = () => {
  const router = useRouter();
  // @ts-ignore
  // const { user } = useUser({ redirectTo: "/login" });

  // Default to overview is no route selected
  router.push("/admin/overview");

  return null;
};

export default Admin;
