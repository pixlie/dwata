import { Component, onMount } from "solid-js";
import ForceGraph3D from "3d-force-graph";

const Graph: Component = () => {
  let containerRef: HTMLDivElement | undefined = undefined;
  const initData = {
    nodes: [{ id: 0 }],
    links: [],
  };

  onMount(() => {
    if (!!containerRef) {
      const graph = ForceGraph3D();
      graph(containerRef).graphData(initData);
    }
  });

  return <div class="w-full h-full p-8" ref={containerRef}></div>;
};

export default Graph;
