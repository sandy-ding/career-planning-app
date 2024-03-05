import React, { memo } from "react";
import { useDrag, useDrop } from "react-dnd";

interface IProps {
  image: string;
  width: number;
  height: number;
  x: number;
  y: number;
  pieces: number;
  position: number;
  onDropPiece: Function;
}

const puzzlePieceStyles = (
  props: IProps & { isOver: boolean; x: number; y: number }
) => ({
  width: `${props.width / props.pieces}px`,
  height: `${props.height / props.pieces}px`,
  margin: "0 -1px -1px",
  backgroundImage: `url(${props.image})`,
  backgroundSize: `${props.width}px ${props.height}px`,
  backgroundPosition: `-${props.x}px -${props.y}px`,
  opacity: `${props.isOver ? "0.2" : "1"}`,
  backgroundRepeat: "no-repeat",
  cursor: "pointer",
});

const Piece = memo((props: IProps) => {
  const { position, onDropPiece } = props;

  const [, dragEl] = useDrag({
    type: "PIECE",
    item: { position },
  });

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: "PIECE",
    drop: (props: { position: string }) => {
      onDropPiece(
        props.position, // source position
        position // drop position
      );
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
  });

  return (
    <div className="puzzle-piece hover:opacity-80" ref={dropRef}>
      <div ref={dragEl} style={puzzlePieceStyles({ ...props, isOver })}></div>
    </div>
  );
});

export default Piece;
