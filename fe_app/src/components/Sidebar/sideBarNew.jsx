import {
  CDBBadge,
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ROLES } from "../../components/ConstantUtils/constants";
import { useBreakpoints } from "../../hooks/useBreakpoint";
import {
  dataItemSideBarForAdmin,
  dataItemSideBarForEmployee,
} from "../ConstantUtils/sideBarConstants";
import { AuthContext } from "../Dashboard/dashboard";

function SideBarNew() {
  const { role, username } = React.useContext(AuthContext);
  const screenSize = useBreakpoints();
  const dataItemSideBar = {
    1: dataItemSideBarForAdmin,
    2: dataItemSideBarForEmployee,
  };
  const [hideSideBar, sethideSideBar] = useState(true);

  const handleClick = () => {
    if (screenSize !== "xs") {
      return;
    }
    sethideSideBar(!hideSideBar);
  };

  if (screenSize === "xs" && hideSideBar) {
    return (
      <div style={{ zIndex: 5 }} className="py-4 min-vh-100 position-fixed">
        <div onClick={handleClick} className="sticky-top btn bg-info z-index-5">
          <i className="fa fa-bars" />
        </div>
      </div>
    );
  }

  return (
    <CDBSidebar
      onClick={handleClick}
      toggled={screenSize === "xs" && hideSideBar}
      className={`min-vh-100 ${
        screenSize === "xs" ? "position-fixed" : undefined
      }`}
      textColor="#fff"
      backgroundColor="#333"
    >
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

      <CDBSidebarFooter style={{ textAlign: "center" }}>
        <div className="sidebar-btn-wrapper" style={{ padding: "20px 5px" }}>
          @QuanLyTinDung
        </div>
      </CDBSidebarFooter>
    </CDBSidebar>
  );
}

export default SideBarNew;
