// import { useState } from "react";
import { PieChartOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { Menu, theme } from "antd";
// import { Button } from "antd";
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem(<NavLink to="admin/zone">Zone</NavLink>, "1", <PieChartOutlined />),
  getItem(
    <NavLink to="admin/circle">Circle</NavLink>,
    "2",
    <PieChartOutlined />
  ),
  getItem(
    <NavLink to="admin/division">Division</NavLink>,
    "3",
    <PieChartOutlined />
  ),
  getItem(<NavLink to="admin/user">User</NavLink>, "4", <PieChartOutlined />),
  getItem(
    <NavLink to="admin/designation">Designation</NavLink>,
    "5",
    <PieChartOutlined />
  ),
  getItem(
    <NavLink to="admin/authority">Authority</NavLink>,
    "6",
    <PieChartOutlined />
  ),
  getItem(
    <NavLink to="admin/hindrance">Hindrance</NavLink>,
    "7",
    <PieChartOutlined />
  ),
  getItem(
    <NavLink to="admin/projecttype">Project Type</NavLink>,
    "8",
    <PieChartOutlined />
  ),
  getItem(
    <NavLink to="/admin/report/login">Login</NavLink>,
    "9",
    <PieChartOutlined />
  ),
  getItem(
    <NavLink to="/admin/report/history">History</NavLink>,
    "10",
    <PieChartOutlined />
  ),
  getItem(
    <NavLink to="/admin/report/audittrail">Audit Trail</NavLink>,
    "11",
    <PieChartOutlined />
  ),
];
const Navbar = () => {
  return (
    <div>
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
      />
    </div>
  );
};
export default Navbar;
