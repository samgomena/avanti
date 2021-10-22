import { AdminHeader as Header } from "../components/Header";
import Section from "../components/Section";
import NavLink from "../components/NavLink";

export default function withAdminNav(Component: React.FC) {
  return function WithAdminNav() {
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
                    <NavLink href="/admin/settings">Settings</NavLink>
                  </div>
                </div>
              </div>
              <div className="col-sm-9 col-lg-10">
                <div className="tab-content">
                  <div className="fade tab-pane active show" role="tabpanel">
                    <Component />
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
