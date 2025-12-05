import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

const socket = io("http://localhost:8080");

export default function Board({ roomId }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 600; // actual pixels
    canvas.height = 400;

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";

    ctxRef.current = ctx;

    socket.on("draw", ({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();
    });
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    const { x, y } = getPos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const { x, y } = getPos(e);

    socket.emit("draw", { roomId, x, y });
  };

  const stopDrawing = () => setIsDrawing(false);

  return (
    <canvas
      ref={canvasRef}
      style={{
        border: "1px solid white",
        width: "600px",
        height: "400px", // CSS size
      }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
}
