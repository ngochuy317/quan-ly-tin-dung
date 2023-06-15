import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Dashboard/dashboard";

function SideBar() {
  const { role, username } = React.useContext(AuthContext);

  const dataItemSideBarForEmployee = [
    {
      id: 5,
      name: "Thống kê giao dịch",
      icon: (
        <FontAwesomeIcon
          icon={icon({ name: "chart-simple", style: "solid" })}
        />
      ),
      path: "/dashboard/reportemp",
      role: ["employee"],
    },
    {
      id: 6,
      name: "Bill máy POS",
      icon: (
        <FontAwesomeIcon
          icon={icon({ name: "file-invoice-dollar", style: "solid" })}
        />
      ),
      path: "/dashboard/stores2",
      role: ["admin", "employee"],
    },
    {
      id: 7,
      name: "Hoá đơn",
      icon: (
        <FontAwesomeIcon icon={icon({ name: "receipt", style: "solid" })} />
      ),
      path: "/dashboard/stores3",
      role: ["admin", "employee"],
    },
    {
      id: 8,
      name: "Quẹt thẻ",
      icon: (
        <FontAwesomeIcon icon={icon({ name: "credit-card", style: "solid" })} />
      ),
      path: "/dashboard/swipecard",
      role: ["admin", "employee"],
    },
    {
      id: 9,
      name: "Lưu thẻ",
      icon: (
        <FontAwesomeIcon icon={icon({ name: "book-open", style: "solid" })} />
      ),
      path: "/dashboard/storecard",
      role: ["admin", "employee"],
    },
    {
      id: 10,
      name: "Danh sách thẻ đã lưu",
      icon: (
        <FontAwesomeIcon icon={icon({ name: "id-card", style: "solid" })} />
      ),
      path: "/dashboard/savedcard",
      role: ["admin", "employee"],
    },
    // {
    //   id: 11,
    //   name: "Lịch sử quẹt thẻ",
    //   icon: (
    //     <FontAwesomeIcon
    //       icon={icon({ name: "clock-rotate-left", style: "solid" })}
    //     />
    //   ),
    //   path: "/dashboard/transaction-history",
    //   role: ["admin", "employee"],
    // },
  ];
  const dataItemSideBarForAdmin = [
    {
      id: 1,
      name: "Cửa hàng ",
      icon: <FontAwesomeIcon icon={icon({ name: "house" })} />,
      path: "/dashboard/stores",
      role: ["admin"],
    },
    {
      id: 2,
      name: "Máy POS",
      icon: (
        <FontAwesomeIcon
          icon={icon({ name: "hard-drive", style: "regular" })}
        />
      ),
      path: "/dashboard/poses",
      role: ["admin"],
    },
    {
      id: 3,
      name: "Sổ lưu thẻ",
      icon: <FontAwesomeIcon icon={icon({ name: "book", style: "solid" })} />,
      path: "/dashboard/notebooks",
      role: ["admin"],
    },
    {
      id: 4,
      name: "Nhân viên",
      icon: <FontAwesomeIcon icon={icon({ name: "users", style: "solid" })} />,
      path: "/dashboard/employees",
      role: ["admin"],
    },
    {
      id: 6,
      name: "Bill máy POS",
      icon: (
        <FontAwesomeIcon
          icon={icon({ name: "file-invoice-dollar", style: "solid" })}
        />
      ),
      path: "/dashboard/stores2",
      role: ["admin", "employee"],
    },
    {
      id: 7,
      name: "Hoá đơn",
      icon: (
        <FontAwesomeIcon icon={icon({ name: "receipt", style: "solid" })} />
      ),
      path: "/dashboard/stores3",
      role: ["admin", "employee"],
    },
    {
      id: 8,
      name: "Quẹt thẻ",
      icon: (
        <FontAwesomeIcon icon={icon({ name: "credit-card", style: "solid" })} />
      ),
      path: "/dashboard/swipecard",
      role: ["admin", "employee"],
    },
    {
      id: 9,
      name: "Lưu thẻ",
      icon: (
        <FontAwesomeIcon icon={icon({ name: "book-open", style: "solid" })} />
      ),
      path: "/dashboard/storecard",
      role: ["admin", "employee"],
    },
    {
      id: 10,
      name: "Danh sách thẻ đã lưu",
      icon: (
        <FontAwesomeIcon icon={icon({ name: "id-card", style: "solid" })} />
      ),
      path: "/dashboard/savedcard",
      role: ["admin", "employee"],
    },
    {
      id: 12,
      name: "Sản phẩm",
      icon: (
        <FontAwesomeIcon
          icon={icon({ name: "boxes-stacked", style: "solid" })}
        />
      ),
      path: "/dashboard/products",
      role: ["admin"],
    },
    {
      id: 13,
      name: "Thống kê giao dịch",
      icon: (
        <FontAwesomeIcon
          icon={icon({ name: "chart-simple", style: "solid" })}
        />
      ),
      path: "/dashboard/reportadm",
      role: ["admin"],
    },
  ];
  const dataItemSideBar = {
    admin: dataItemSideBarForAdmin,
    employee: dataItemSideBarForEmployee,
  };
  return (
    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
      <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
        <ul
          className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100"
          id="menu"
        >
          <span className="ms-1 d-none d-sm-inline">
            Tên đăng nhập: {username}
          </span>
          <span className="ms-1 d-none d-sm-inline">Chức vụ: {role}</span>
          {dataItemSideBar[role]?.map((item) => (
            <li className="nav-item w-100" key={item.id}>
              <Link to={item.path} style={{ textDecoration: "none" }}>
                <SideBarItem
                  {...item}
                  isActive={localStorage.getItem("activeTab") === item.path}
                  onClick={() => localStorage.setItem("activeTab", item.path)}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SideBarItem(props) {
  return (
    <a
      href="/#"
      className={`nav-link align-middle px-0 text-center ${
        props.isActive ? "active" : ""
      }`}
      onClick={props.onClick}
    >
      {props.icon}
      <span className="ms-1 d-none d-sm-inline">
        {props.name}{" "}
        {JSON.stringify(props.role) === JSON.stringify(["admin"]) ? (
          <FontAwesomeIcon icon={icon({ name: "lock", style: "solid" })} />
        ) : null}
      </span>
    </a>
  );
}

export default SideBar;
