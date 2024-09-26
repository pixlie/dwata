import { Component } from "solid-js";
import { useTailwindClasses } from "../../stores/TailwindClasses";
import GetIcon from "../../utils/Icons";

interface IPropTypes {
  label: string;
  icon: string;
  href: string;
  isActive?: boolean;
}

const SidebarLink: Component<IPropTypes> = (props) => {
  const [_, { getClasses }] = useTailwindClasses();

  let classes =
    "group flex gap-x-3 rounded-md p-3 leading-6 mx-2 " +
    getClasses()["sideBar.link"];

  return (
    <a class={classes} href={props.href}>
      <GetIcon iconName={props.icon} />
      <span class="text-sm font-semibold sr-only">{props.label}</span>
    </a>
  );
};

// const NavigationLink: Component<IPropTypes> = (props) => {
//   {
//     /* Current: "bg-gray-800 text-white", Default: "text-gray-400 hover:text-white hover:bg-gray-800" */
//   }
//   return (
//     <a
//       href="#"
//       class="group flex gap-x-3 rounded-md bg-gray-800 p-3 text-sm font-semibold leading-6 text-white"
//     >
//       <svg
//         class="h-6 w-6 shrink-0"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke-width="1.5"
//         stroke="currentColor"
//         aria-hidden="true"
//       >
//         <path
//           stroke-linecap="round"
//           stroke-linejoin="round"
//           d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
//         />
//       </svg>
//       <span class="sr-only">Dashboard</span>
//     </a>
//   );
// };

export default SidebarLink;
