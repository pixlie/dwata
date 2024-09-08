interface Route {
  label: string;
  icon: string;
  href: string;
}

const routes = [
  // {
  //   label: "Focus",
  //   icon: "fa-solid fa-circle-dot",
  //   href: "/coming-soon/focus",
  // },
  {
    label: "Insights",
    icon: "insight",
    href: "/insights",
  },
  {
    label: "Emails",
    icon: "inbox",
    href: "/search/emails",
  },
  // {
  //   label: "Messages",
  //   icon: "fa-solid fa-message",
  //   href: "/coming-soon/messages",
  // },
  {
    label: "Contacts",
    icon: "address-book",
    href: "/coming-soon/contacts",
  },
  // {
  //   label: "Notifications",
  //   icon: "fa-solid fa-bell",
  //   href: "/coming-soon/notifications",
  // },
  // {
  //   label: "Groups",
  //   icon: "fa-solid fa-user-group",
  //   href: "/coming-soon/groups",
  // },
  // {
  //   label: "Calendar",
  //   icon: "fa-solid fa-calendar",
  //   href: "/coming-soon/calendar",
  // },
  {
    label: "Files",
    icon: "folder",
    href: "/search/files",
  },
  // {
  //   label: "Tasks",
  //   icon: "fa-solid fa-list-check",
  //   href: "/coming-soon/tasks",
  // },
];

export type { Route };
export { routes };
