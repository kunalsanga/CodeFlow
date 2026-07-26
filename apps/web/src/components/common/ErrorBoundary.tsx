"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CodeFlow Execution Error Boundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 bg-red-950/40 border border-red-800/80 rounded-xl text-red-200 font-mono text-xs flex flex-col gap-3 my-4">
          <div className="flex items-center gap-2 font-bold text-red-400 text-sm">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span>Visualization Execution Error</span>
          </div>
          <p className="text-slate-300">
            {this.state.error?.message || "An unexpected error occurred while rendering the visualization."}
          </p>
          <button
            onClick={this.handleReset}
            className="self-start px-3 py-1.5 bg-red-900/60 hover:bg-red-800 border border-red-700 text-white rounded-lg font-sans font-medium text-xs flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Execution
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
