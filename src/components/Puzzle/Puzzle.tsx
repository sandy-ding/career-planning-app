import React, { CSSProperties, useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { shuffle, isEqual } from "./utils";
import Piece from "./Piece";

interface IProps {
  image: string;
  width: number;
  height: number;
  pieces: number;
  onDrop: Function;
  onComplete: Function;
}

export const puzzleWrapperStyles = (props: {
  width: number;
  height: number;
}) => ({
  display: "flex",
  flexWrap: "wrap",
  padding: 0,
  width: `${props.width}px`,
  height: `${props.height}px`,
});

const Puzzle = (props: IProps) => {
  const { width, height, pieces, onDrop, onComplete } = props;
  const rootPositions = [...Array(pieces * pieces).keys()];
  const [positions, setPositions] = useState(shuffle(rootPositions));

  const coords = rootPositions.map((pos) => ({
    x: Math.floor((pos % pieces) * (width / pieces)),
    y: Math.floor(pos / pieces) * (height / pieces),
  }));

  const onDropPiece = (sourcePosition: any, dropPosition: any) => {
    const oldPositions = positions.slice();
    const newPositions = [];

    for (let i in oldPositions) {
      const value = oldPositions[i];
      let newValue = value;

      if (value === sourcePosition) {
        newValue = dropPosition;
      } else if (value === dropPosition) {
        newValue = sourcePosition;
      }

      newPositions.push(newValue);
    }

    setPositions(newPositions);

    onDrop(newPositions);
    if (isEqual(rootPositions, newPositions)) {
      onComplete();
    }
  };

  const renderPieces = () =>
    positions.map((i) => (
      <Piece
        key={i}
        position={i}
        onDropPiece={onDropPiece}
        {...coords[i]}
        {...props}
      />
    ));

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={puzzleWrapperStyles({ width, height }) as CSSProperties}>
        {renderPieces()}
      </div>
    </DndProvider>
  );
};

Puzzle.defaultProps = {
  width: 400,
  height: 300,
  pieces: 3,
  onComplete: () => {},
};

export default Puzzle;
