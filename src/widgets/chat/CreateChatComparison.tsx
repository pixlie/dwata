import { Component } from "solid-js";
import { Module } from "../../api_types/Module";
import Form from "../interactable/ConfiguredForm";
import { useParams } from "@solidjs/router";

interface IPropTypes {
  message: string;
}

const CreateChatComparison: Component<IPropTypes> = (props) => {
  const params = useParams();

  if (!params.threadId) {
    return null;
  }

  return (
    <Form
      module={"Chat" as Module}
      initialData={{
        message: props.message,
        comparedToRootChatId: parseInt(params.threadId),
      }}
      postSaveNavigateTo={`/chat/compare/${params.threadId}?requestedNewModel`}
      submitButtomLabel={"Add another model"}
      showPrelude={false}
    />
  );
};

export default CreateChatComparison;
