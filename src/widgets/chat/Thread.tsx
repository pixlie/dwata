import { Component, For } from "solid-js";
import Heading from "../typography/Heading";

interface IPropTypes {
  title: string;
  summary: string;
  labels: Array<string> | null;
}

const Thread: Component<IPropTypes> = (props) => {
  return (
    <div class="my-3 bg-zinc-800 p-3 rounded-md cursor-pointer">
      <Heading size="base">{props.title}</Heading>
      <p class="text-zinc-400 text-sm">{props.summary}</p>
      {!!props.labels && props.labels.length && (
        <div class="mt-2">
          <For each={props.labels}>
            {(label) => (
              <span class="inline-block text-sm text-zinc-600 px-2 mr-3 bg-zinc-900 rounded cursor-default">
                {label}
              </span>
            )}
          </For>
        </div>
      )}
    </div>
  );
};

export default Thread;
