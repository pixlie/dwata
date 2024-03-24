import { Component } from "solid-js";
import GridHead from "./GridHead";
import GridBody from "./GridBody";

const Grid: Component = () => {
  return (
    <div class="overflow-auto w-full">
      <table class="text-sm text-left rtl:text-right text-gray-400 table-fixed border-collapse dwata-grid">
        <GridHead />
        <GridBody />
      </table>
    </div>
  );
};

export default Grid;
