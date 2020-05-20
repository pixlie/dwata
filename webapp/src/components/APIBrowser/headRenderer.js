import React from "react";


const HeadItem = ({ toggleOrderBy, head }) => {
  const handleClick = event => {
    event.preventDefault();
    toggleOrderBy(head);
  }

  return (
    <th onClick={handleClick}>{head}</th>
  );
}


export default (columns) => {
  const headList = [];
  const DefaultCell = ({ data }) => <th>{data}</th>;

  for (let i = 0; i < columns.length; i++) {
    /*
    const head = columns.find(x => x.name === queriedColumns[i]);
    if (head.has_foreign_keys) {
      headList.push(null);
    } else {
      headList.push(DefaultCell);
    }
    */
   headList.push(DefaultCell);
  }

  return headList;
}