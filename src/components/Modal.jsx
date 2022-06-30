import React from "react";
import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import Time from "./Time";
import { useDispatch } from "react-redux";
import { isResetChange, levelChange } from "../redux/gameSlice";

const Modal = ({ isOpen, handleClose }) => {
  const duration = useAppSelector((state) => state.watch.time);
  const isWin = useAppSelector((state) => state.game.isWinning);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className={isOpen ? "modal show" : "modal hide"}>
      <div className="wrapper">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <div>
          <h1>{isWin ? "CONGRATULATION" : "GLHF!"}</h1>
          <p className="message">
            You {isWin ? "win" : "lose"} the game in <Time time={duration} />
          </p>
          <div className="group">
            <button
              className="button"
              onClick={() => {
                handleClose();
                dispatch(levelChange(""));
                navigate("/");
              }}
            >
              Home page
            </button>
            <button
              className="button"
              onClick={() => {
                handleClose();
                dispatch(isResetChange(true));
              }}
            >
              New game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
