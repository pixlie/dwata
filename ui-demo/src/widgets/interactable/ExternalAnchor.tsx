import { Component } from "solid-js";

interface IPropTypes {
  href: string;
  children: string;
}

const ExternalAnchor: Component<IPropTypes> = ({ href, children }) => {
  return (
    <a
      class="text-blue-500 hover:underline"
      target="_blank"
      rel="noreferrer"
      href={href}
    >
      {children}
    </a>
  );
};

export default ExternalAnchor;
