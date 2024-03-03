import { Component, For } from "solid-js";

import Heading from "../widgets/typography/Heading";
import Thread from "../widgets/chat/Thread";

const threads = [
  {
    title: "Orders with insufficient inventory",
    summary:
      "I run my eCommerce site on Shopify and every once in a while I get an order where the inventory is not updated.",
    labels: ["#shopify", "#orders", "#inventory"],
  },
  {
    title: "Orders with shipping delays",
    summary:
      "I run my eCommerce site on Shopify and every once in a while I get an order where the inventory is not updated.",
    labels: ["#shopify", "#orders", "#shipping"],
  },
];

const Home: Component = () => {
  return (
    <>
      <Heading size="3xl">Home</Heading>
      <Heading size="xl">Conversations with AI</Heading>

      <div class="flex flex-row">
        <div class="grow max-w-screen-sm">
          <For each={threads}>{(thread) => <Thread {...thread} />}</For>
        </div>
      </div>
    </>
  );
};

export default Home;
