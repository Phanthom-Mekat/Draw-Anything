import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

export const FabricCanvas = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.8,
      backgroundColor: "#f0f0f0",
    } );
    setCanvas(fabricCanvas);

    const handleResize = () => {
      fabricCanvas.setDimensions({
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.8,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      fabricCanvas.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;

    canvas.isDrawingMode = tool === "pen";
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushSize;

    if (tool === "eraser") {
      canvas.on("mouse:down", eraseObject);
    } else {
      canvas.off("mouse:down", eraseObject);
    }
  }, [tool, canvas, color, brushSize]);

  const eraseObject = (event) => {
    const target = canvas.findTarget(event.e);
    if (target) {
      canvas.remove(target);
    }
  };

  const addShape = (shape) => {
    if (!canvas) return;

    let shapeObject;
    const commonProps = {
      left: canvas.width / 2,
      top: canvas.height / 2,
      fill: color,
      originX: "center",
      originY: "center",
    };

    switch (shape) {
      case "rectangle":
        shapeObject = new fabric.Rect({
          ...commonProps,
          width: 100,
          height: 100,
        });
        break;
      case "circle":
        shapeObject = new fabric.Circle({
          ...commonProps,
          radius: 50,
        });
        break;
      case "triangle":
        shapeObject = new fabric.Triangle({
          ...commonProps,
          width: 100,
          height: 100,
        });
        break;
      case "text":
        shapeObject = new fabric.Textbox("Hello", {
          ...commonProps,
          fontSize: 24,
        });
        break;
    }

    canvas.add(shapeObject);
    canvas.setActiveObject(shapeObject);
  };

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.setBackgroundColor("#f0f0f0");
    }
  };

  const downloadCanvas = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
      });
      const link = document.createElement("a");
      link.download = "canvas-drawing.png";
      link.href = dataURL;
      link.click();
    }
  };

  return (
    <div className="fabric-canvas-container">
      <div className="toolbar">
        <div className="tool-group">
          <button
            className={`tool-btn ${tool === "pen" ? "active" : ""}`}
            onClick={() => setTool("pen")}
          >
            ✏️ Pen
          </button>
          <button
            className={`tool-btn ${tool === "eraser" ? "active" : ""}`}
            onClick={() => setTool("eraser")}
          >
            🧽 Eraser
          </button>
        </div>
        <div className="tool-group">
          <button className="tool-btn" onClick={() => addShape("rectangle")}>
            🟥 Rectangle
          </button>
          <button className="tool-btn" onClick={() => addShape("circle")}>
            ⭕ Circle
          </button>
          <button className="tool-btn" onClick={() => addShape("triangle")}>
            🔺 Triangle
          </button>
          <button className="tool-btn" onClick={() => addShape("text")}>
            🔤 Text
          </button>
        </div>
        <div className="tool-group">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-picker"
          />
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="brush-size-slider"
          />
        </div>
        <div className="tool-group">
          <button className="tool-btn" onClick={clearCanvas}>
            🗑️ Clear
          </button>
          <button className="tool-btn" onClick={downloadCanvas}>
            💾 Save
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} className="fabric-canvas"></canvas>
    </div>
  );
};