import { useContext } from "react";

import { QueryContext } from "utils";
import useQuerySpecification from "stores/querySpecification";
import QueryLoader from "./QueryLoader";
import SavedQueryLoader from "./SavedQueryLoader";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
// import ColumnSelector from "components/QueryEditor/ColumnSelector";
// import FilterEditor from "components/QueryEditor/FilterEditor";
// import MergeData from "components/QueryEditor/MergeData";
import Paginator from "components/QueryEditor/Paginator";

function Grid({ showHeader = true, showPaginator = true } = {}): JSX.Element {
  // const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (store) => store.specifications && store.specifications["main"]
  );

  const Loader =
    !!querySpecification && !!querySpecification.isSavedQuery
      ? SavedQueryLoader
      : QueryLoader;

  return (
    <Loader>
      <>
        <div>
          <table className="font-content tracking-normal bg-white border-collapse">
            <thead>{showHeader ? <TableHead /> : null}</thead>

            <tbody>
              <TableBody />
            </tbody>
          </table>

          {/* <Actions /> */}
          {showPaginator ? <Paginator /> : null}
        </div>

        {/* {queryContext.isColumnSelectorOpen ? <ColumnSelector /> : null}
        {queryContext.isFilterEditorOpen ? <FilterEditor /> : null}
        {queryContext.isMergeUIOpen ? <MergeData /> : null} */}
      </>
    </Loader>
  );
}

export default Grid;
