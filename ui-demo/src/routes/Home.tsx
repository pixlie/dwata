import { Component } from "solid-js";

import Heading from "../widgets/typography/Heading";

const Home: Component = () => {
  return (
    <>
      <div class="flex h-full flex-col">
        <div class="grow">
          <Heading size="3xl">Home</Heading>
          <Heading size="xl">Activities</Heading>
        </div>

        <textarea class="mt-4 h-24 w-full grow-0 rounded-md border border-gray-500 bg-zinc-800 p-3 text-gray-50"></textarea>
      </div>
    </>
  );
};

export default Home;
