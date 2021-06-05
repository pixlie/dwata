import { Switch, Redirect, Route, Link } from "react-router-dom";

import Account from "components/Admin/Account";
import Users from "components/Admin/Users";
import Auth from "components/Admin/Auth";
import Tables from "components/Admin/Tables";
import DataSources from "components/Admin/DataSources";
import DataSource from "components/Admin/DataSources";

export function SideNavItem({ label, icon, path }) {
  return (
    <div className="my-6 py-2 cursor-pointer hover:bg-green-600">
      <Link to={`/manage/${path}/`}>
        <span className="block text-white text-2xl text-center">
          <i className={icon} />
        </span>
        <span className="block text-xs text-white font-medium text-center">
          {label}
        </span>
      </Link>
    </div>
  );
}

export const sideNavItems = [
  {
    label: "My Account",
    path: "account",
    icon: "fas fa-user-circle",
    component: Account,
  },
  {
    label: "Users",
    path: "users",
    icon: "fas fa-users",
    component: Users,
  },
  {
    label: "Permissions",
    path: "permissions",
    icon: "fas fa-user-tag",
  },
  {
    label: "Auth",
    path: "auth",
    icon: "far fa-id-card",
    component: Auth,
  },
  {
    label: "Data sources",
    path: "data-sources",
    icon: "fas fa-database",
    component: DataSources,
  },
  {
    label: "Tables",
    path: "tables",
    icon: "fas fa-table",
    component: Tables,
  },
];

export function Admin() {
  return (
    <div className="flex flex-row">
      <div
        className="w-24 bg-green-700"
        style={{ height: "calc(100vh - 52px)" }}
      >
        {sideNavItems.map((navItem) => (
          <SideNavItem key={`ad-sd-${navItem.path}`} {...navItem} />
        ))}
      </div>

      <Switch>
        <Redirect from="/manage/" to="/manage/account/" exact />

        {sideNavItems.map((navItem) => (
          <Route
            key={`ad-rt-${navItem.path}`}
            path={`/manage/${navItem.path}`}
            component={navItem.component}
          />
        ))}
      </Switch>
    </div>
  );
}

export default Admin;
