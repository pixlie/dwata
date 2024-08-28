interface Route {
  label: string;
  icon: string;
  href: string;
}

const searchRoutes = [
  // {
  //   label: "Focus",
  //   icon: "fa-solid fa-circle-dot",
  //   href: "/coming-soon/focus",
  //   status: "disabled",
  // },
  {
    label: "All Emails",
    icon: "fa-solid fa-envelope",
    href: "/search/emails",
    status: "disabled",
  },
  // {
  //   label: "Messages",
  //   icon: "fa-solid fa-message",
  //   href: "/coming-soon/messages",
  //   status: "disabled",
  // },
  {
    label: "Contacts",
    icon: "fa-solid fa-address-book",
    href: "/coming-soon/contacts",
    status: "disabled",
  },
  // {
  //   label: "Notifications",
  //   icon: "fa-solid fa-bell",
  //   href: "/coming-soon/notifications",
  //   status: "disabled",
  // },
  // {
  //   label: "Groups",
  //   icon: "fa-solid fa-user-group",
  //   href: "/coming-soon/groups",
  //   status: "disabled",
  // },
  // {
  //   label: "Calendar",
  //   icon: "fa-solid fa-calendar",
  //   href: "/coming-soon/calendar",
  //   status: "disabled",
  // },
  {
    label: "Files",
    icon: "fa-solid fa-file",
    href: "/search/files",
  },
  // {
  //   label: "Tasks",
  //   icon: "fa-solid fa-list-check",
  //   href: "/coming-soon/tasks",
  //   status: "disabled",
  // },
];

export type { Route };
export { searchRoutes };
