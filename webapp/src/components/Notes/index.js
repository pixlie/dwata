import React, { useEffect } from "react";

import * as globalConstants from "services/global/constants";
import {
  useGlobal,
  useData,
  useQueryContext,
  useQuerySpecification,
} from "services/store";
import { QueryContext } from "utils";
import QueryLoader from "components/Grid/QueryLoader";
import { Modal, Hx } from "components/LayoutHelpers";
import NotesList from "./List";

export default () => {
  const mainApp = useQueryContext((state) => state["main"]);
  const showNotes = useGlobal((state) => state.showNotes);
  const isNotesVisible = useGlobal((state) => state.isNotesVisible);
  const navigationButtonMeta = useGlobal(
    (state) => state.navigationButtonMeta["notes"]
  );
  // This is data for notes
  const notesData = useData((state) => state["notes"]);
  // This is Query Specification for whatever data is in the main app (like table, saved queries, reports, etc.)
  const querySpecification = useQuerySpecification(
    (state) => state[mainApp.key]
  );
  const notesQuerySpecification = useQuerySpecification(
    (state) => state["notes"]
  );
  const initiateQuerySpecification = useQuerySpecification(
    (state) => state.initiateQuerySpecification
  );

  const { appType } = mainApp;
  const notesQS = {
    sourceLabel: "dwata_meta",
    select: [
      {
        label: "dwata_meta_note",
        tableName: "dwata_meta_note",
      },
    ],
    fetchNeeded: true,
  };

  useEffect(() => {
    initiateQuerySpecification("notes", notesQS);
  }, []);

  if (
    !isNotesVisible ||
    appType !== globalConstants.APP_NAME_BROWSER ||
    !notesQuerySpecification ||
    !notesQuerySpecification.sourceLabel
  ) {
    return null;
  }

  const handleClose = () => {
    showNotes();
  };

  return (
    <Modal
      callerPosition={navigationButtonMeta.position}
      theme="light"
      maxWidth="2xl"
      toggleModal={handleClose}
    >
      <Hx x="4">Notes</Hx>
      <QueryContext.Provider
        value={{ key: "notes", currentQS: querySpecification }}
      >
        <QueryLoader>
          {notesData && notesData.isReady ? <NotesList /> : null}
        </QueryLoader>
      </QueryContext.Provider>
    </Modal>
  );
};
