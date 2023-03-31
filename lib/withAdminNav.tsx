import { AdminHeader as Header } from "../components/Header";
import Section from "../components/Section";
import NavLink from "../components/NavLink";
import Button from "react-bootstrap/Button";
import { signOut } from "next-auth/react";
import type { ComponentType } from "react";

export default function withAdminNav<
  T extends JSX.IntrinsicAttributes & Object
>(Component: React.FC<T>) {
  return function WithAdminNav(props: T) {
    return (
      <>
        <Header />
        <Section>
          <div className="container">
            <div className="row">
              <div className="col-sm-3 col-lg-2">
                <div className="flex flex-column nav nav-pills" role="tablist">
                  <div className="nav-item">
                    <NavLink href="/admin/overview">Overview</NavLink>
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
              <div className="col-sm-9 col-lg-10">
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
