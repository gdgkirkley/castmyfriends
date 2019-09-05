import React from "react";

const CastShow = props => {
  return (
    <div>
      <p>Casting for {props.match.params.id}</p>
    </div>
  );
};

export default CastShow;
