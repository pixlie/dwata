import React, { Fragment, useState } from "react";
import ReactMarkdown from "react-markdown";

import { useData, useQuerySpecification } from "services/store";
import { Button } from "components/LayoutHelpers";
import NotesItem from "./Item";

const notesHelp = `### What are Notes?
Notes help you and your team save time to understand data in relation to your business.
Notes are great documentation for onboarding new team members.

You can use notes to:
- Explain what some tables do
- Which tables are important at which stage of business
- Which tables are important for which teams in your business

The notes editor supports [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
syntax, which is automatically converted to HTML.
`;

export default () => {
  const notesData = useData((state) => state["notes"]);
  const querySpecification = useQuerySpecification((state) => state["notes"]);

  const [state, setState] = useState({
    createNew: null,
  });

  const handleClickCreate = () => {
    setState({
      createNew: true,
    });
  };

  const handleCancelCreate = () => {
    setState({
      createNew: false,
    });
  };

  return (
    <Fragment>
      {querySpecification.count === 0 ? (
        <div>
          There are no notes yet,{" "}
          <Button theme="link" attributes={{ onClick: handleClickCreate }}>
            create one?
          </Button>
          <br />
          &nbsp;
          <br />
          {state.createNew ? (
            <NotesItem isNew handleCancelCreate={handleCancelCreate} />
          ) : (
            <ReactMarkdown source={notesHelp} linkTarget="_blank" />
          )}
        </div>
      ) : null}
      {querySpecification.count > 0 &&
        notesData.rows.map((x) => <h1>Hello</h1>)}
    </Fragment>
  );
};
