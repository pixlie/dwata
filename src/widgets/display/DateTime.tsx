import { Component } from "solid-js";

interface IPropTypes {
  seconds: number;
}

const SecondsToDate: Component<IPropTypes> = (props) => {
  var date = new Date(1970, 0, 1);
  date.setSeconds(props.seconds);

  return <>{date.toLocaleDateString()}</>;
};

const SecondsToRelativeDateTime: Component<IPropTypes> = (props) => {
  var date = new Date(1970, 0, 1);
  date.setSeconds(props.seconds);

  // If given date is today, then show time only
  if (date.toDateString() === new Date().toDateString()) {
    return <>{date.toLocaleTimeString()}</>;
  } else {
    return <>{date.toLocaleString()}</>;
  }
};

export { SecondsToRelativeDateTime, SecondsToDate };
