"use client";

import React from "react";
import { X, Keyboard } from "lucide-react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Space", description: "Play / Pause timeline playback" },
    { key: "→ (Right Arrow)", description: "Step forward 1 execution frame" },
    { key: "← (Left Arrow)", description: "Step backward 1 execution frame" },
    { key: "Home / R", description: "Reset timeline to Step 0" },
    { key: "End", description: "Jump to final execution step" },
    { key: "P", description: "Toggle Interactive Practice Mode" },
    { key: "S", description: "Open Share Session modal" },
    { key: "E", description: "Export high-res SVG visualization image" },
    { key: "?", description: "Toggle this Keyboard Shortcuts reference" },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-md w-full p-6 text-[#e6edf3] shadow-2xl flex flex-col gap-4 relative font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8b949e] hover:text-white p-1 rounded-lg hover:bg-[#21262d] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-[#58a6ff]" />
          <h2 className="text-base font-bold text-white">Keyboard Shortcuts Reference</h2>
        </div>

        <div className="flex flex-col divide-y divide-[#30363d] border border-[#30363d] rounded-lg bg-[#0d1117]">
          {shortcuts.map((item, idx) => (
            <div key={idx} className="p-3 flex items-center justify-between font-mono text-xs">
              <span className="bg-[#21262d] text-[#58a6ff] border border-[#30363d] px-2 py-0.5 rounded font-bold">
                {item.key}
              </span>
              <span className="text-[#8b949e] font-sans text-right">{item.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;
