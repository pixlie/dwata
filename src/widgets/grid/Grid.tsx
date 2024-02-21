import { Component } from "solid-js";
import GridHead from "./GridHead";
import GridBody from "./GridBody";

const Grid: Component = () => {
  return (
    <table class="w-full">
      <GridHead />
      <GridBody />
    </table>
  );
};

export default Grid;
