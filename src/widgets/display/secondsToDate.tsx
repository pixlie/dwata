import { Component } from "solid-js";

interface IPropTypes {
  seconds: number;
}

const SecondsToDate: Component<IPropTypes> = (props) => {
  var date = new Date(1970, 0, 1);
  date.setSeconds(props.seconds);

  return <>{date.toLocaleDateString()}</>;
};

export default SecondsToDate;
