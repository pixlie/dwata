import { Component, For, createMemo } from "solid-js";
import ReplyItem from "./ReplyItem";
import { useChat } from "../../stores/chat";
import { useUserInterface } from "../../stores/userInterface";
import Button from "../interactable/Button";
import ChatForm from "./ChatForm";
import ChatStatus from "./ChatStatus";

interface IPropTypes {
  rootChatId: number;
  isComparing?: boolean;
}

const ThreadView: Component<IPropTypes> = (props) => {
  const [chat] = useChat();
  const [_, { getColors }] = useUserInterface();

  const getRootChat = createMemo(() =>
    chat.chatList.find((x) => x.id === props.rootChatId),
  );

  return (
    <>
      {!props.isComparing ? (
        <>
          <ReplyItem {...getRootChat()!} index={0} />

          <div
            class="mb-4 font-thin"
            style={{ color: getColors().colors["editor.foreground"] }}
          >
            <Button
              size="sm"
              href={`/chat/compare/${props.rootChatId}`}
              label="Compare"
            />{" "}
            responses from different AI models
          </div>
        </>
      ) : (
        <ChatStatus {...getRootChat()!} />
      )}

      <For each={chat.chatReplyList[props.rootChatId]}>
        {(reply, index) => <ReplyItem {...reply} index={index()} />}
      </For>

      <ChatForm
        rootChatId={props.rootChatId}
        defaultAIModel={getRootChat()!.requestedAiModel || undefined}
      />
    </>
  );
};

export default ThreadView;
