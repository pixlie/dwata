import React, { useState } from "react";

import Account from "./Account";
import Users from "./Users";
import Auth from "./Auth";
import Tables from "./Tables";
import DataSources from "./DataSources";

const SideNavItem = ({ label, icon, tab, setActiveTab }) => {
  const handleClick = () => {
    setActiveTab(tab);
  };

  return (
    <div
      className="my-6 py-2 cursor-pointer hover:bg-green-600"
      onClick={handleClick}
    >
      <span className="block text-white text-3xl text-center">
        <i className={icon} />
      </span>
      <span className="block text-sm text-white font-medium text-center">
        {label}
      </span>
    </div>
  );
};

const sideNavItems = [
  {
    label: "Account",
    tab: "account",
    icon: "fas fa-user-circle",
    component: Account,
  },
  {
    label: "Users",
    tab: "users",
    icon: "fas fa-users",
    component: Users,
  },
  {
    label: "Tables",
    tab: "tables",
    icon: "fas fa-table",
    component: Tables,
  },
  {
    label: "Permissions",
    tab: "permissions",
    icon: "fas fa-user-tag",
  },
  {
    label: "Auth",
    tab: "auth",
    icon: "far fa-id-card",
    component: Auth,
  },
  {
    label: "Data sources",
    tab: "sources",
    icon: "fas fa-database",
    component: DataSources,
  },
];

export default () => {
  const [state, setState] = useState({
    currentTab: "account",
  });

  const handleSideNavChange = (tabName) => {
    setState({
      currentTab: tabName,
    });
  };

  const currentNavItem = sideNavItems.find((el) => el.tab === state.currentTab);
  const CurrentComponent = currentNavItem.component;

  return (
    <div className="flex flex-row">
      <div
        className="w-24 bg-green-700"
        style={{ height: "calc(100vh - 57px)" }}
      >
        {sideNavItems.map((navItem, i) => (
          <SideNavItem
            key={`ad-sd-${i}`}
            {...navItem}
            setActiveTab={handleSideNavChange}
          />
        ))}
      </div>

      <div className="p-8">
        <CurrentComponent />
      </div>
    </div>
  );
};
