import { Component } from "solid-js";

interface IPropTypes {
  class: string;
}

const Inbox: Component<IPropTypes> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    class={props.class}
    stroke="currentColor"
  >
    <path
      fill="currentColor"
      d="M83.19 174.4a8 8 0 0 0 11.21-1.6a52 52 0 0 1 83.2 0a8 8 0 1 0 12.8-9.6a67.9 67.9 0 0 0-27.4-21.69a40 40 0 1 0-53.94 0A67.9 67.9 0 0 0 81.6 163.2a8 8 0 0 0 1.59 11.2M112 112a24 24 0 1 1 24 24a24 24 0 0 1-24-24m96-88H64a16 16 0 0 0-16 16v24H32a8 8 0 0 0 0 16h16v40H32a8 8 0 0 0 0 16h16v40H32a8 8 0 0 0 0 16h16v24a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V40a16 16 0 0 0-16-16m0 192H64V40h144Z"
    />
  </svg>
);

export default Inbox;
