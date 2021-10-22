import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { AdminHeader as Header } from "../components/Header";
import Section from "../components/Section";

import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

import useUser from "../lib/useUser";
import { SelectCallback } from "react-bootstrap/esm/helpers";

const Admin: React.FC = () => {
  const router = useRouter();
  // @ts-ignore
  // const { user } = useUser({ redirectTo: "/login" });
  // console.log(user);

  const Overview = dynamic(() => import("../components/Admin/Overview"));
  const Menu = dynamic(() => import("../components/Admin/Menu"));
  const Settings = dynamic(() => import("../components/Admin/Settings"));

  // Default to `/overview` if no route selected
  const handleSelect: SelectCallback = (eventKey) =>
    router.push(`admin/${eventKey ?? "overview"}`);

  console.log(router);

  return (
    <>
      <Header />
      <Section>
        <Tab.Container defaultActiveKey="overview">
          <div className="row">
            <div className="col-sm-3 col-lg-2">
              <Nav
                variant="pills"
                className="flex-column"
                onSelect={handleSelect}
              >
                <Nav.Item>
                  <Nav.Link eventKey="overview">Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="menu">Menu</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="settings">Settings</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            <div className="col-sm-9 col-lg-10">
              <Tab.Content>
                <Tab.Pane eventKey="overview">
                  <Overview />
                </Tab.Pane>
                <Tab.Pane eventKey="menu">
                  <Menu />
                </Tab.Pane>
                <Tab.Pane eventKey="settings">
                  <Settings />
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
      </Section>
    </>
  );
};

export default Admin;
