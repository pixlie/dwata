import { Component } from "solid-js";
import GridHead from "./GridHead";

const Grid: Component = () => {
  return (
    <table class="font-content border-collapse bg-white tracking-normal">
      <GridHead />
    </table>
  );
};

export default Grid;
