interface Route {
  label: string;
  icon: string;
  href: string;
}

const searchRoutes = [
  {
    label: "Focus",
    icon: "fa-solid fa-circle-dot",
    href: "/search/focus",
  },
  {
    label: "All Emails",
    icon: "fa-solid fa-envelope",
    href: "/search/emails",
  },
  {
    label: "Threads",
    icon: "fa-solid fa-comments",
    href: "/search/threads",
  },
  {
    label: "Direct Messages",
    icon: "fa-solid fa-message",
    href: "/search/direct-messages",
  },
  {
    label: "Notifications",
    icon: "fa-solid fa-bell",
    href: "/search/notifications",
  },
  {
    label: "Groups",
    icon: "fa-solid fa-user-group",
    href: "/search/groups",
  },
  {
    label: "Calendar",
    icon: "fa-solid fa-calendar",
    href: "/search/calendar",
  },
  {
    label: "Files",
    icon: "fa-solid fa-file",
    href: "/search/files",
  },
  {
    label: "Tasks",
    icon: "fa-solid fa-list-check",
    href: "/search/tasks",
  },
];

export type { Route };
export { searchRoutes };
