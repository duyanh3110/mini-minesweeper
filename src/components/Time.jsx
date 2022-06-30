import React from "react";

const Time = ({ time }) => {
  return (
    <span className="numbers">
      <span>{("0" + Math.floor((time / 3600000) % 60)).slice(-2)}:</span>
      <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
      <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
    </span>
  );
};

export default Time;
