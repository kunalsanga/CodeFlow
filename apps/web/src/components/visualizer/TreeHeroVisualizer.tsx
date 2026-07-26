"use client";

import React, { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ITraceEvent } from "@/types/trace";
import { IBSTSnapshot, IBSTNodeState, buildBSTSnapshotsFromTrace } from "@/lib/events/semanticEventEngine";
import { GitFork, Activity } from "lucide-react";

// ============================================================
// TREE LAYOUT ENGINE
// Computes (x, y) positions for each node in a binary tree
// using an inorder-position algorithm for balanced spacing.
// ============================================================

interface IPositionedNode {
  id: string;
  val: number;
  x: number;
  y: number;
  leftId: string | null;
  rightId: string | null;
}

function layoutTree(
  rootId: string | null,
  nodes: Record<string, IBSTNodeState>
): IPositionedNode[] {
  if (!rootId || !nodes[rootId]) return [];

  const positioned: IPositionedNode[] = [];
  let inorderIndex = 0;

  const NODE_X_SPACING = 80;
  const NODE_Y_SPACING = 90;

  const visitedInTraversal = new Set<string>();

  function inorderTraverse(nodeId: string | null, depth: number) {
    if (!nodeId || !nodes[nodeId] || visitedInTraversal.has(nodeId) || depth > 50) return;

    visitedInTraversal.add(nodeId);

    const node = nodes[nodeId];

    // Left subtree first
    inorderTraverse(node.leftId, depth + 1);

    // Position this node
    positioned.push({
      id: node.id,
      val: node.val,
      x: inorderIndex * NODE_X_SPACING,
      y: depth * NODE_Y_SPACING,
      leftId: node.leftId,
      rightId: node.rightId,
    });
    inorderIndex++;

    // Right subtree
    inorderTraverse(node.rightId, depth + 1);
  }

  inorderTraverse(rootId, 0);

  // Center the tree horizontally
  if (positioned.length > 0) {
    const minX = Math.min(...positioned.map(n => n.x));
    const maxX = Math.max(...positioned.map(n => n.x));
    const centerOffset = (minX + maxX) / 2;
    positioned.forEach(n => { n.x -= centerOffset; });
  }

  return positioned;
}

// ============================================================
// TREE HERO VISUALIZER
// Renders an actual hierarchical tree with edges and nodes.
// Consumes ONLY semantic events — never reads stack frames.
// ============================================================

interface TreeHeroVisualizerProps {
  currentEvent: ITraceEvent | null;
  allTraceEvents?: ITraceEvent[];
  currentStepIndex?: number;
}

const TreeHeroVisualizerComponent: React.FC<TreeHeroVisualizerProps> = ({
  currentEvent,
  allTraceEvents,
  currentStepIndex = 0
}) => {
  // Build full BST snapshot timeline from trace
  const snapshots = useMemo(() => {
    if (!allTraceEvents || allTraceEvents.length === 0) return [];
    return buildBSTSnapshotsFromTrace(allTraceEvents);
  }, [allTraceEvents]);

  // Get the snapshot for the current step
  const snapshot: IBSTSnapshot | null = snapshots[currentStepIndex] || null;

  if (!snapshot) return null;

  const { rootId, nodes, activeInsertVal, activeVisitId, semanticEvent } = snapshot;
  const positionedNodes = layoutTree(rootId, nodes);
  const nodeCount = Object.keys(nodes).length;

  // Build a lookup from node id -> positioned node for edge drawing
  const posMap: Record<string, IPositionedNode> = {};
  positionedNodes.forEach(n => { posMap[n.id] = n; });

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-[#0b0e14] overflow-hidden">
      {/* Header Badge */}
      <div className="mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/40">
        <GitFork className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-bold font-mono text-emerald-300 uppercase tracking-wider">
          Binary Search Tree Visualizer
        </span>
      </div>

      {/* Semantic Event Decision Banner */}
      {semanticEvent && semanticEvent.type !== "STEP" && (
        <motion.div
          key={`event_${semanticEvent.stepIndex}_${semanticEvent.type}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-[#161b22]/90 border-2 border-emerald-500/60 rounded-xl px-5 py-3 shadow-2xl font-mono text-sm flex items-center gap-3"
        >
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
          <span className="font-extrabold text-emerald-300">
            {semanticEvent.description}
          </span>
        </motion.div>
      )}

      {/* Tree Canvas */}
      {nodeCount === 0 ? (
        <div className="text-gray-500 italic text-sm">Tree is empty — inserting first node...</div>
      ) : (
        <div className="relative bg-[#161b22]/80 border-2 border-[#30363d] rounded-2xl shadow-2xl p-8 min-w-[400px] min-h-[300px] flex items-center justify-center">
          {/* SVG Edges Layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
          >
            {positionedNodes.map(pNode => {
              const parentX = pNode.x + 200;
              const parentY = pNode.y + 40;

              return (
                <React.Fragment key={`edges_${pNode.id}`}>
                  {pNode.leftId && posMap[pNode.leftId] && (
                    <motion.line
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      x1={parentX}
                      y1={parentY + 24}
                      x2={posMap[pNode.leftId].x + 200}
                      y2={posMap[pNode.leftId].y + 40 - 24}
                      stroke="#34d399"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  )}
                  {pNode.rightId && posMap[pNode.rightId] && (
                    <motion.line
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      x1={parentX}
                      y1={parentY + 24}
                      x2={posMap[pNode.rightId].x + 200}
                      y2={posMap[pNode.rightId].y + 40 - 24}
                      stroke="#22d3ee"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </svg>

          {/* Nodes Layer */}
          <AnimatePresence>
            {positionedNodes.map(pNode => {
              const isNewlyInserted = activeInsertVal !== null && pNode.val === activeInsertVal;
              const isBeingVisited = pNode.id === activeVisitId;

              return (
                <motion.div
                  key={`tree_node_${pNode.id}`}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: pNode.x + 200 - 24,
                    top: pNode.y + 40 - 24,
                  }}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-mono font-extrabold text-lg shadow-2xl transition-all ${
                      isNewlyInserted
                        ? "bg-amber-600 text-white border-2 border-white ring-4 ring-amber-500/50 shadow-amber-500/60"
                        : isBeingVisited
                        ? "bg-blue-600 text-white border-2 border-blue-300 ring-4 ring-blue-500/50 shadow-blue-500/60"
                        : "bg-emerald-950 text-emerald-200 border-2 border-emerald-400"
                    }`}
                  >
                    {pNode.val}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Node Count Footer */}
      <div className="mt-3 text-xs text-gray-500 font-mono">
        {nodeCount} node{nodeCount !== 1 ? "s" : ""} in tree
      </div>
    </div>
  );
};

export const TreeHeroVisualizer = memo(TreeHeroVisualizerComponent);
