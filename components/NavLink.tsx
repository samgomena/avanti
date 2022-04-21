import Link from "next/link";
import { useRouter } from "next/router";

const NavLink: React.FC<{
  children: React.ReactNode;
  href: string;
  subMenu?: boolean;
}> = ({ children, href, subMenu = false }) => {
  const router = useRouter();
  return (
    <Link href={href}>
      <a
        className={`nav-link ${href === router.asPath && "active"} ${
          subMenu && "text-center"
        }`}
      >
        {children}
      </a>
    </Link>
  );
};

export default NavLink;
