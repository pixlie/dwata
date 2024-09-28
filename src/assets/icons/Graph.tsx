import { Component } from "solid-js";

interface IPropTypes {
  class: string;
}

// https://icon-sets.iconify.design/ph/graph-light/
const Graph: Component<IPropTypes> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    stroke-width="1.5"
    stroke="currentColor"
    viewBox="0 0 256 256"
    class={props.class}
  >
    <path
      fill="currentColor"
      d="M200 154a29.87 29.87 0 0 0-19.5 7.23l-25.62-19.93A29.8 29.8 0 0 0 158 128a31 31 0 0 0-.22-3.6L174 119a30 30 0 1 0-4-15a31 31 0 0 0 .22 3.6L154 113a29.91 29.91 0 0 0-32.42-14.31l-8.14-18.3a30 30 0 1 0-11 4.88l8.14 18.3a29.92 29.92 0 0 0-8.52 39.43L74 168a30.08 30.08 0 1 0 8 9l28-25a29.91 29.91 0 0 0 37.47-1.23l25.62 19.93A30 30 0 1 0 200 154m0-68a18 18 0 1 1-18 18a18 18 0 0 1 18-18M78 56a18 18 0 1 1 18 18a18 18 0 0 1-18-18M56 210a18 18 0 1 1 18-18a18 18 0 0 1-18 18m72-64a18 18 0 1 1 18-18a18 18 0 0 1-18 18m72 56a18 18 0 1 1 18-18a18 18 0 0 1-18 18"
    />
  </svg>
);

export default Graph;
