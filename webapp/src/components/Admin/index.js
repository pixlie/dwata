import React, { useState } from "react";

import Account from "./Account";
import Auth from "./Auth";

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
  },
  {
    label: "Users",
    tab: "users",
    icon: "fas fa-users",
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
  },
  {
    label: "Data sources",
    tab: "sources",
    icon: "fas fa-database",
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
        {state.currentTab === "account" ? <Account /> : null}
        {state.currentTab === "auth" ? <Auth /> : null}
      </div>
    </div>
  );
};
