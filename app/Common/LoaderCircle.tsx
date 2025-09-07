import React from "react";

//Whole page loader
export const Loader = () => {
  return (
    <div className="loader_wrapper textclr">
      {" "}
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="loader-text">{"Loading..."}</div>
    </div>
  );
};