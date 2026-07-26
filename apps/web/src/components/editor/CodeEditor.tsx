"use client";

import React, { useRef, useEffect } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { useExecutionStore } from "@/store/useExecutionStore";
import { Sparkles, Code2 } from "lucide-react";

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

  const isEmpty = !code || code.trim() === "";

  return (
    <div className="h-full w-full flex flex-col bg-[#0d1117] border-r border-[#30363d] relative">
      {/* Editor Header */}
      <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Code Editor
          </span>
        </div>
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

        {/* Empty Editor Guidance Placeholder Overlay */}
        {isEmpty && (
          <div className="absolute inset-0 bg-[#0d1117]/95 pointer-events-none p-6 flex flex-col justify-center items-center text-center z-10 font-sans">
            <div className="p-3 bg-indigo-950/80 border border-indigo-500/40 rounded-full mb-3 text-indigo-400 shadow-lg">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Paste your code to visualize execution</h3>
            <p className="text-xs text-gray-400 max-w-sm mb-4 leading-relaxed">
              CodeFlow automatically detects the programming language, parses AST topology, traces memory allocations, and generates interactive visualizations.
            </p>

            <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-xl text-left max-w-sm w-full font-mono text-xs text-slate-300 space-y-1.5 shadow-inner">
              <div className="text-indigo-400 font-bold mb-1">Supported Languages & Structures:</div>
              <div className="text-gray-400">✓ Python, C++, Java, JavaScript, TypeScript</div>
              <div className="text-gray-400">✓ Graphs, Trees, Heaps, Dynamic Programming</div>
              <div className="text-gray-400">✓ Recursion Call Stack, RAM Memory Tracing</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
