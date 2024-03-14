import { Component, For } from "solid-js";
import Thread from "../widgets/chat/Thread";
import { Route, RouteSectionProps } from "@solidjs/router";
import Heading from "../widgets/typography/Heading";
import { ChatThreadProvider, useChatThread } from "../stores/chatThread";
import ChatThreadLoader from "../widgets/chat/ChatThreadLoader";
import NewThread from "../widgets/chat/NewThread";

// const threads = [
//   {
//     title: "Orders with insufficient inventory",
//     summary:
//       "I run my eCommerce site on Shopify and every once in a while I get an order where the inventory is not updated." +
//       "I am using a SaaS product for inventory management. They have integration with Shopify but I am selling on other platforms as well...",
//     labels: ["#shopify", "#orders", "#inventory"],
//     aiProvider: "OpenAI",
//     aiModel: "gpt-3.5-turbo-0125",
//   },
//   {
//     title: "Orders with shipping delays",
//     summary:
//       "I use multiple shipment providers and orders come from 3 eCommerce platforms. I want to keep track of the orders that are" +
//       " facing shipping delays, ordered by the delay amount in days. I also want to have status information from the shipping provider.",
//     labels: ["#shopify", "#orders", "#shipping"],
//     aiProvider: "Groq",
//     aiModel: "mixtral-8x7b-32768",
//   },
//   {
//     title: "What are some metrics I should track for my business?",
//     summary:
//       "I would like to know some of the common metrics that I should track. Please feel free to ask me questions regarding my business.",
//     labels: ["#metrics"],
//     aiProvider: "Groq",
//     aiModel: "mixtral-8x7b-32768",
//   },
// ];

const ChatThreadIndex: Component = () => {
  const [chatThread] = useChatThread();

  return (
    <>
      <NewThread />
      <div class="mb-4" />
      <Heading size="3xl">Recent chats with AI</Heading>

      <div class="flex flex-row">
        <div class="grow max-w-screen-sm">
          <For each={chatThread.threadList}>
            {(thread) => <Thread {...thread} />}
          </For>
        </div>
      </div>
    </>
  );
};

const ChatThreadWrapper: Component<RouteSectionProps> = (props) => {
  return <>{props.children}</>;
};

const ChatThreadRoutes: Component = () => {
  return (
    <ChatThreadProvider>
      <ChatThreadLoader />
      {/* <Route path="/start" component={DatabaseForm} /> */}
      <Route path="/thread/:id" component={ChatThreadIndex} />

      <Route path="/" component={ChatThreadIndex} />
    </ChatThreadProvider>
  );
};

export { ChatThreadWrapper, ChatThreadRoutes };
