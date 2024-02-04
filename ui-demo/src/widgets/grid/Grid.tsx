import { Component } from "solid-js";
import GridHead from "./GridHead";

const Grid: Component = () => {
  return (
    <table class="w-full">
      <GridHead />
    </table>
  );
};

export default Grid;
