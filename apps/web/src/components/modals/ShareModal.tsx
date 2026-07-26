"use client";

import React, { useState } from "react";
import { X, Copy, Check, ExternalLink, Code } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: string;
  currentStep: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  code,
  language,
  currentStep,
}) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedEmbed, setCopiedEmbed] = useState<boolean>(false);

  if (!isOpen) return null;

  // Compress state payload to URL-safe base64
  const payload = JSON.stringify({ code, language, currentStep });
  const encodedPayload = btoa(encodeURIComponent(payload));
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://codeflow-web.vercel.app";
  const shareUrl = `${baseUrl}/?share=${encodedPayload}`;
  const embedCode = `<iframe src="${baseUrl}/?share=${encodedPayload}&embed=true" width="100%" height="600" frameborder="0"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-lg w-full p-6 text-[#e6edf3] shadow-2xl flex flex-col gap-5 relative font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8b949e] hover:text-white p-1 rounded-lg hover:bg-[#21262d] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Share Visualization Session
          </h2>
          <p className="text-xs text-[#8b949e] mt-1">
            Anyone with this link will rehydrate the exact code execution state and jump to step {currentStep + 1}.
          </p>
        </div>

        {/* Shareable Link Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#8b949e]">Share Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs font-mono text-[#58a6ff] focus:outline-none select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 bg-[#58a6ff] hover:bg-[#79c0ff] text-[#0d1117] font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* IFrame Embed Snippet */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#8b949e] flex items-center gap-1">
            <Code className="w-3.5 h-3.5 text-[#3fb950]" /> Copy iFrame Embed Code (for blogs & docs)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={embedCode}
              className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs font-mono text-[#8b949e] focus:outline-none select-all"
            />
            <button
              onClick={handleCopyEmbed}
              className="px-3 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
            >
              {copiedEmbed ? <Check className="w-4 h-4 text-[#3fb950]" /> : <Copy className="w-4 h-4" />}
              {copiedEmbed ? "Copied!" : "Copy Snippet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
