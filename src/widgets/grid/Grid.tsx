import { Component } from "solid-js";
import GridHead from "./GridHead";
import GridBody from "./GridBody";

const Grid: Component = () => {
  return (
    <table class="max-w-full overflow-x-scroll">
      <GridHead />
      <GridBody />
    </table>
  );
};

export default Grid;
