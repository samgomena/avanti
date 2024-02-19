import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";

const NavLink: React.FC<{
  children: React.ReactNode;
  href: string;
  subMenu?: boolean;
}> = ({ children, href, subMenu = false }) => {
  const router = useRouter();
  return (
    <Link
      href={href}
      className={classNames("nav-link", {
        "active rounded": href === router.asPath,
        "ms-4 border-start border-secondary-subtle": subMenu,
      })}
      style={{
        ...(subMenu && {
          borderTopLeftRadius: "0",
          borderBottomLeftRadius: "0",
        }),
      }}
    >
      {children}
    </Link>
  );
};

export default NavLink;
