import React from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
  CDBSidebarFooter,
  CDBBadge,
  CDBIcon,
} from "cdbreact";
import { AuthContext } from "../Dashboard/dashboard";
import { Roles } from "../../components/ConstantUtils/constants";
import { NavLink } from "react-router-dom";
import {
  dataItemSideBarForAdmin,
  dataItemSideBarForEmployee,
} from "../ConstantUtils/sideBarConstants";

function SideBarNew() {
  const { role, username } = React.useContext(AuthContext);
  const dataItemSideBar = {
    admin: dataItemSideBarForAdmin,
    employee: dataItemSideBarForEmployee,
  };
  return (
    <CDBSidebar className="min-vh-100" textColor="#fff" backgroundColor="#333">
      <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
        <div>{username}</div>
        <div>{Roles.find((c) => c.roleKey === role)?.roleName}</div>
      </CDBSidebarHeader>
      <CDBSidebarContent>
        <CDBSidebarMenu>
          {dataItemSideBar[role]?.map((item) => (
            <NavLink
              // exact
              to={item.path}
              className={
                localStorage.getItem("activeTab") === item.path
                  ? "activeClicked"
                  : null
              }
              key={item.id}
            >
              <CDBSidebarMenuItem
                suffix={
                  item?.private === true ? (
                    <CDBBadge color="danger" size="small">
                      AD
                    </CDBBadge>
                  ) : null
                }
                icon={item.icon}
                onClick={() => localStorage.setItem("activeTab", item.path)}
              >
                {item.name}
              </CDBSidebarMenuItem>
            </NavLink>
          ))}
        </CDBSidebarMenu>
      </CDBSidebarContent>

      {/* <CDBSidebarFooter style={{ textAlign: "center" }}>
        <div className="sidebar-btn-wrapper" style={{ padding: "20px 5px" }}>
          Quản lý tín dụng
        </div>
      </CDBSidebarFooter> */}
    </CDBSidebar>
  );
}

export default SideBarNew;
