import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LEVEL, BEGINNER_LEVEL, ADVANTAGE_LEVEL } from "../constant";
import { levelChange } from "../redux/gameSlice";
import { useAppSelector } from "../redux/hooks";
import { fetchMinesLocation } from "../redux/gameSlice";

const Welcome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const gameLevel = useAppSelector((state) => state.game.level);

  const handleClick = (level) => {
    dispatch(levelChange(level));
  };

  useEffect(() => {
    if (gameLevel) {
      const params =
        gameLevel === LEVEL.BEGINNER ? BEGINNER_LEVEL : ADVANTAGE_LEVEL;
      dispatch(fetchMinesLocation(params));
      navigate("/game");
    }
  }, [gameLevel]);

  return (
    <div className="welcome">
      <h1 className="title">Mini Minesweeper</h1>
      <p className="message">Please choose level: Beginner or Advantage</p>
      <div>
        <button className="button" onClick={() => handleClick(LEVEL.BEGINNER)}>
          Beginner
        </button>
        <button className="button" onClick={() => handleClick(LEVEL.ADVANTAGE)}>
          Advantage
        </button>
      </div>
    </div>
  );
};

export default Welcome;
