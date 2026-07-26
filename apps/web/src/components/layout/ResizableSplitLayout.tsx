"use client";

import React, { useState, useRef, useCallback } from "react";

interface ResizableSplitLayoutProps {
  leftComponent: React.ReactNode;
  rightComponent: React.ReactNode;
  initialLeftWidthPercent?: number;
  minLeftWidthPercent?: number;
  maxLeftWidthPercent?: number;
}

export const ResizableSplitLayout: React.FC<ResizableSplitLayoutProps> = ({
  leftComponent,
  rightComponent,
  initialLeftWidthPercent = 40,
  minLeftWidthPercent = 20,
  maxLeftWidthPercent = 70,
}) => {
  const [leftWidthPercent, setLeftWidthPercent] = useState<number>(initialLeftWidthPercent);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = e.clientX - containerRect.left;
      const newPercent = (newLeftWidth / containerRect.width) * 100;

      const clampedPercent = Math.max(
        minLeftWidthPercent,
        Math.min(maxLeftWidthPercent, newPercent)
      );

      setLeftWidthPercent(clampedPercent);
    },
    [isDragging, minLeftWidthPercent, maxLeftWidthPercent]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full h-full flex overflow-hidden select-none"
    >
      {/* Left Pane (Monaco Editor) */}
      <div
        style={{ width: `${leftWidthPercent}%` }}
        className="h-full overflow-hidden shrink-0 flex flex-col"
      >
        {leftComponent}
      </div>

      {/* Resizable Drag Divider Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`w-2.5 h-full bg-[#161b22] hover:bg-[#58a6ff] cursor-col-resize flex items-center justify-center border-x border-[#30363d] transition-colors z-30 group ${
          isDragging ? "bg-[#58a6ff]" : ""
        }`}
        title="Drag to resize editor & visualizer split ratio"
      >
        <div className="w-0.5 h-8 bg-[#30363d] group-hover:bg-white rounded-full transition-colors" />
      </div>

      {/* Right Pane (Visualization Canvas) */}
      <div
        style={{ width: `${100 - leftWidthPercent}%` }}
        className="h-full overflow-hidden shrink-0 flex flex-col flex-1"
      >
        {rightComponent}
      </div>
    </div>
  );
};

export default ResizableSplitLayout;
