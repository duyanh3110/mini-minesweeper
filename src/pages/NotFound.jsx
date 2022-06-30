import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <p className="error title">404 - Not Found</p>
      <div className="message">
        Maybe this page moved? Got deleted? Is hiding out in quarantine? Never
        existed in the first place?
      </div>
      <span className="message">
        Let's go{" "}
        <span className="link" onClick={() => navigate("/")}>
          home
        </span>{" "}
        and try from there.
      </span>
    </div>
  );
};

export default NotFound;
