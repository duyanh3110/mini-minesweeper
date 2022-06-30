import React, { useEffect, useState } from "react";

const Cell = ({ value, click, rightClick }) => {
  const [cellValue, setCellValue] = useState(null);

  const getCellValue = (value) => {
    if (!value.isOpen) {
      return value.isFlag ? "🚩" : null;
    }
    if (value.isMine) {
      return "💣";
    }
    if (value.bombNear === 0) {
      return null;
    }
    return value.bombNear;
  };

  useEffect(() => {
    const result = getCellValue(value);
    setCellValue(result);
  });

  const getClassName = () => {
    if (!value.isOpen) {
      if (value.isFlag) return "cell flag";
      return "cell hidden";
    }
    if (value.isMine) return "cell mine";
    return "cell open";
  };

  return (
    <div className={getClassName()} onClick={click} onContextMenu={rightClick}>
      {cellValue}
    </div>
  );
};

export default Cell;
