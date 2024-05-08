import React from "react";

const WrapperForm = (props) => {
  return (
    <div
      className="container-fluid pt-2 pb-2 pl-2 pr-2"
      style={{ background: "#FFFFFF" }}
    >
      <div className="row">
        <div className="col">
          <div className="card pr-3 pl-3">
            <div className="card-body">{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrapperForm;
