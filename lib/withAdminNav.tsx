import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import { AdminHeader as Header } from "../components/Header";
import NavLink from "../components/NavLink";
import Section from "../components/Section";

function withAdminNav<T extends JSX.IntrinsicAttributes & Object>(
  Component: React.FC<T>
) {
  return function WithAdminNav(props: T) {
    const router = useRouter();
    return (
      <>
        <Header />
        <Section>
          <div className="container">
            <select
              value={router.asPath}
              onChange={(e) => router.push(e.target.value)}
              className="form-select d-md-none mb-4"
            >
              <option value="/admin/overview">Overview</option>
              <option value="/admin/deployments">Deployments</option>
              <optgroup label="Info">
                <option value="/admin/info/edit">Edit</option>
              </optgroup>
              <optgroup label="Menu">
                <option value="/admin/menu/add">Add</option>
                <option value="/admin/menu/edit">Edit</option>
              </optgroup>
              <option value="/admin/alerts">Alerts</option>
              <option value="/admin/people">People</option>
              <option value="/admin/settings">Settings</option>
            </select>
            <div className="row">
              <div className="col-sm-3 col-lg-2 d-none d-md-block">
                <div className="flex flex-column nav nav-pills" role="tablist">
                  <div className="nav-item">
                    <NavLink href="/admin/overview">Overview</NavLink>
                  </div>
                  <div className="nav-item">
                    <NavLink href="/admin/deployments">Deployments</NavLink>
                  </div>
                  <div className="nav-item">
                    <NavLink href="/admin/info">Info</NavLink>
                  </div>
                  <div className="nav-item">
                    <NavLink href="/admin/info/edit" subMenu>
                      Edit
                    </NavLink>
                  </div>
                  <div className="nav-item">
                    <NavLink href="/admin/menu">Menu</NavLink>
                  </div>
                  <div className="nav-item">
                    <NavLink href="/admin/menu/add" subMenu>
                      Add
                    </NavLink>
                  </div>
                  <div className="nav-item">
                    <NavLink href="/admin/menu/edit" subMenu>
                      Edit
                    </NavLink>
                  </div>
                  <div className="nav-item">
                    <NavLink href="/admin/alerts">Alerts</NavLink>
                  </div>
                  <div className="nav-item">
                    <NavLink href="/admin/people">People</NavLink>
                  </div>
                  <div className="nav-item">
                    <NavLink href="/admin/settings">Settings</NavLink>
                  </div>
                  <hr />
                  <div className="nav-item">
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      size="sm"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-md-9 col-lg-10">
                <div className="tab-content">
                  <div className="fade tab-pane active show" role="tabpanel">
                    <Component {...props} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </>
    );
  };
}

withAdminNav.displayName = "WithAdminNav";
export default withAdminNav;
