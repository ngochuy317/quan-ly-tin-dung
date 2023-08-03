import {
  CDBBadge,
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import React from "react";
import { NavLink } from "react-router-dom";
import { ROLES } from "../../components/ConstantUtils/constants";
import {
  dataItemSideBarForAdmin,
  dataItemSideBarForEmployee,
} from "../ConstantUtils/sideBarConstants";
import { AuthContext } from "../Dashboard/dashboard";

function SideBarNew() {
  const { role, username } = React.useContext(AuthContext);
  const dataItemSideBar = {
    1: dataItemSideBarForAdmin,
    2: dataItemSideBarForEmployee,
  };
  return (
    <CDBSidebar className="min-vh-100" textColor="#fff" backgroundColor="#333">
      <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
        <div>{username}</div>
        <div>{ROLES.find((c) => c.roleKey === role)?.roleName}</div>
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
                    <CDBBadge color="danger" size="small" borderType="pill">
                      A
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
