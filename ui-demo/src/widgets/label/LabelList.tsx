import { Component, For, onMount } from "solid-js";

import { useLabel } from "../../stores/label";
import SidebarItem from "../navigation/SidebarItem";
import SidebarHeading from "../navigation/SidebarHeading";

const LabelList: Component = () => {
  const [crStore, { loadLabels }] = useLabel();

  onMount(() => {
    loadLabels();
  });

  return (
    <>
      <SidebarHeading label="Labels" icon="fa-solid fa-tags" />

      <For each={crStore.labels}>
        {(item) => (
          <SidebarItem label={item.label} icon="fa-solid fa-hashtag" />
        )}
      </For>
      <div class="mt-4 border-b border-gray-800" />
    </>
  );
};

export default LabelList;
