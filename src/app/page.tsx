"use client";
import { GateEngine } from "@/engine/App/GateEngine";
import { useEffect, useRef } from "react";

export default function Home() {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<GateEngine>(null);

  useEffect(() => {
    if (refCanvas.current && document) {
      refCanvas.current.width = window.innerWidth;
      refCanvas.current.height = window.innerHeight;
      engine.current = new GateEngine(refCanvas.current);
      engine.current.start();
    }

    return () => {
      if (engine.current) {
        engine.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      <canvas ref={refCanvas} />
    </div>
  );
}
