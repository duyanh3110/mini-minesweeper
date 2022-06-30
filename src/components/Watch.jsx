import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../redux/hooks";
import { timeChange } from "../redux/watchSlice";
import Time from "./Time";

const Watch = () => {
  const dispatch = useDispatch();

  const [time, setTime] = useState(0);
  const duration = useAppSelector((state) => state.watch.time);
  const isRunning = useAppSelector((state) => state.watch.isRunning);

  useEffect(() => {
    setTime(duration);
  }, [duration]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1000);
      }, 1000);
    } else if (!isRunning) {
      dispatch(timeChange(time));
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="stopwatch">
      <span>Time: </span>
      <Time time={time} />
    </div>
  );
};

export default Watch;
