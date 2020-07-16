import React from "react";

import { Modal } from "components/LayoutHelpers";
import ColumnSelectorInner from "./ColumnSelector";
import FilterEditorInner from "./FilterEditor";
import OrderEditorInner from "./OrderEditor";

const ColumnSelector = () => (
  <Modal>
    <ColumnSelectorInner />
  </Modal>
);

const FilterEditor = () => (
  <Modal>
    <FilterEditorInner />
  </Modal>
);

const OrderEditor = () => (
  <Modal>
    <OrderEditorInner />
  </Modal>
);

export { ColumnSelector, FilterEditor, OrderEditor };

export default () => {
  return (
    <Modal theme="light">
      <div className="flex items-stretch">
        <div className="flex-1 px-2">
          <ColumnSelectorInner />
        </div>

        <div className="flex-1 px-2">
          <FilterEditorInner />
        </div>

        <div className="flex-1 px-2">
          <OrderEditorInner />
        </div>
      </div>
    </Modal>
  );
};
