"use client";

import React, { useRef, useEffect } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { useExecutionStore } from "@/store/useExecutionStore";
import { usePlaybackStore } from "@/store/usePlaybackStore";

interface CodeEditorProps {
  activeLineNumber?: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ activeLineNumber }) => {
  const { code, setCode, isExecuting } = useExecutionStore();
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
  };

  // Synchronize active line highlight with playback step line
  useEffect(() => {
    if (!editorRef.current || !activeLineNumber) return;

    const editor = editorRef.current;
    
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
      {
        range: {
          startLineNumber: activeLineNumber,
          startColumn: 1,
          endLineNumber: activeLineNumber,
          endColumn: 1000
        },
        options: {
          isWholeLine: true,
          className: "bg-blue-900/40 border-l-4 border-blue-500 font-semibold"
        }
      }
    ]);

    editor.revealLineInCenterIfOutsideViewport(activeLineNumber);
  }, [activeLineNumber]);

  return (
    <div className="h-full w-full flex flex-col bg-[#0d1117] border-r border-[#30363d]">
      <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
          Python Editor
        </span>
        {isExecuting && (
          <span className="text-xs text-blue-400 animate-pulse font-medium">
            Tracing Execution...
          </span>
        )}
      </div>

      <div className="flex-1 w-full relative">
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: "on",
            tabSize: 4,
            cursorBlinking: "smooth"
          }}
        />
      </div>
    </div>
  );
};
