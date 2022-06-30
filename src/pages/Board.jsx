import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cell from "../components/Cell";
import Modal from "../components/Modal";
import Watch from "../components/Watch";
import { ADVANTAGE_LEVEL, BEGINNER_LEVEL, LEVEL } from "../constant";
import {
  fetchMinesLocation,
  isResetChange,
  isWinningChange,
} from "../redux/gameSlice";
import { useAppSelector } from "../redux/hooks";
import { isRunningChange, timeChange } from "../redux/watchSlice";

const Board = () => {
  const dispatch = useDispatch();

  const [boardData, setBoardData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [countTime, setCountTime] = useState("off");

  const gameLevel = useAppSelector((state) => state.game.level);
  const gameSize =
    gameLevel === LEVEL.BEGINNER ? BEGINNER_LEVEL.size : ADVANTAGE_LEVEL.size;
  const minesList = useAppSelector((state) => state.game.minesLocation);
  const [minesNumber, setMinesNumber] = useState(0);
  const isReset = useAppSelector((state) => state.game.isReset);

  const createInitData = (row, column) => {
    let data = [];

    for (let i = 0; i < column; i++) {
      data.push([]);
      for (let j = 0; j < row; j++) {
        data[i][j] = {
          x: i,
          y: j,
          isOpen: false,
          bombNear: 0,
          isFlag: false,
          isMine: false,
        };
      }
    }
    return data;
  };

  const plantBombs = (data) => {
    for (let item of minesList) {
      if (data[item.x][item.y]) {
        data[item.x][item.y].isMine = true;
      }
    }
    return data;
  };

  const getBombNearNumber = (data, row, column) => {
    for (let i = 0; i < column; i++) {
      for (let j = 0; j < row; j++) {
        if (!data[i][j].isMine) {
          let mine = 0;
          const area = getSquareCell(
            data[i][j].x,
            data[i][j].y,
            data,
            row,
            column
          );
          for (let value of area) {
            if (value.isMine) {
              mine++;
            }
          }
          data[i][j].bombNear = mine;
        }
      }
    }
    return data;
  };

  const getSquareCell = (x, y, data, height, width) => {
    const el = [];

    if (x > 0) {
      el.push(data[x - 1][y]);
    }

    if (x < height - 1) {
      el.push(data[x + 1][y]);
    }

    if (y > 0) {
      el.push(data[x][y - 1]);
    }

    if (y < width - 1) {
      el.push(data[x][y + 1]);
    }

    if (x > 0 && y > 0) {
      el.push(data[x - 1][y - 1]);
    }

    if (x > 0 && y < width - 1) {
      el.push(data[x - 1][y + 1]);
    }

    if (x < height - 1 && y < width - 1) {
      el.push(data[x + 1][y + 1]);
    }

    if (x < height - 1 && y > 0) {
      el.push(data[x + 1][y - 1]);
    }

    return el;
  };

  const openAllCell = () => {
    let newBoardData = boardData.slice();
    for (let row of newBoardData) {
      for (let cell of row) {
        cell.isOpen = true;
      }
    }
    setBoardData(newBoardData);
  };

  const openSelectedCells = (x, y, data) => {
    const area = getSquareCell(x, y, data, gameSize, gameSize);
    for (let cell of area) {
      if (
        (cell.bombNear === 0 || !cell.isMine) &&
        !cell.isFlag &&
        !cell.isOpen
      ) {
        data[cell.x][cell.y].isOpen = true;
        if (cell.bombNear === 0) openSelectedCells(cell.x, cell.y, data);
      }
    }
    return data;
  };

  const checkWin = (data) => {
    for (let row of data) {
      for (let cell of row) {
        if (cell.isMine && !cell.isFlag) {
          return false;
        }
      }
    }
    return true;
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCountTime("reset");
    dispatch(timeChange(0));
    dispatch(isRunningChange(false));
  };

  const countHiddenMine = (data) => {
    for (let row of data) {
      for (let cell of row) {
        if (cell.isMine && !cell.isOpen) {
          return false;
        }
      }
    }
    return true;
  };

  const handleClick = (x, y) => {
    if (countTime === "off") {
      setCountTime("on");
    }

    const clickedCell = boardData[x][y];
    if (clickedCell.isOpen || clickedCell.isFlag) return;

    if (clickedCell.isMine) {
      dispatch(isRunningChange(false));
      dispatch(isWinningChange(false));
      openAllCell();
      openModal();
      return;
    }

    if (clickedCell.bombNear === 0) {
      let newBoardData = boardData.slice();
      newBoardData = openSelectedCells(x, y, newBoardData);
      setBoardData(newBoardData);
      return;
    }

    const newBoardData = boardData.slice();
    newBoardData[x][y].isFlag = false;
    newBoardData[x][y].isOpen = true;
    setBoardData(newBoardData);
  };

  const handleRightClick = (e, x, y) => {
    e.preventDefault();
    if (countTime === "off") {
      setCountTime("on");
    }
    let newBoardData = boardData.slice();
    newBoardData[x][y].isOpen = false;
    newBoardData[x][y].isFlag = !boardData[x][y].isFlag;
    if (newBoardData[x][y].isFlag) {
      setMinesNumber(minesNumber + 1);
    } else {
      setMinesNumber(minesNumber - 1);
    }
    setBoardData(newBoardData);
  };

  const renderBoard = useCallback(() => {
    return boardData.map((row) => {
      return row.map((cell) => {
        return (
          <Cell
            key={`${cell.x}_${cell.y}`}
            value={cell}
            click={() => handleClick(cell.x, cell.y)}
            rightClick={(e) => handleRightClick(e, cell.x, cell.y)}
          />
        );
      });
    });
  }, [boardData]);

  useEffect(() => {
    if ((boardData.length === 0 && minesList.length > 0) || isReset) {
      let initData = createInitData(gameSize, gameSize);
      plantBombs(initData);
      getBombNearNumber(initData, gameSize, gameSize);
      if (isReset) {
        dispatch(isResetChange(false));
      }
      setBoardData(initData);
    }
    if (countTime === "on") {
      const isWin = countHiddenMine(boardData);
      if (isWin) {
        dispatch(isWinningChange(true));
        openModal();
      }
    }
  }, [boardData, minesList]);

  useEffect(() => {
    if (countTime === "on") {
      dispatch(isRunningChange(true));
    }
    if (countTime === "reset") {
      setCountTime("off");
      if (isReset) {
        const params =
          gameLevel === LEVEL.BEGINNER ? BEGINNER_LEVEL : ADVANTAGE_LEVEL;
        dispatch(fetchMinesLocation(params));
      }
    }
  }, [countTime]);

  useEffect(() => {
    const mines =
      gameLevel === LEVEL.BEGINNER
        ? BEGINNER_LEVEL.mines
        : ADVANTAGE_LEVEL.mines;
    if (minesNumber === mines) {
      let isWin = checkWin(boardData);
      if (isWin) {
        dispatch(isWinningChange(true));
        dispatch(isRunningChange(false));
        openModal();
      }
    }
  }, [minesNumber]);

  return (
    <div className="board">
      <div className="header">
        <h1 className="title">Mini Minesweeper</h1>
        <Watch />
      </div>
      <div
        className={
          gameLevel === LEVEL.BEGINNER ? "beginner-board" : "advantage-board"
        }
      >
        {boardData && renderBoard()}
      </div>
      {isOpen && (
        <Modal
          isWin={true}
          duration="abc"
          isOpen={isOpen}
          handleClose={closeModal}
        />
      )}
    </div>
  );
};

export default Board;
