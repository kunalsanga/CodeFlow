import { ITraceEvent, IHeapObject, IVariableValue } from "@/types/trace";

// ============================================================
// SEMANTIC EVENT TYPES
// Language-agnostic event vocabulary for each DSA concept.
// Renderers consume ONLY these events. Never raw stack frames.
// ============================================================

export type SemanticEventType =
  // Tree Events
  | "VISIT_NODE"
  | "COMPARE"
  | "GO_LEFT"
  | "GO_RIGHT"
  | "CREATE_NODE"
  | "LINK_LEFT"
  | "LINK_RIGHT"
  // Sorting Events
  | "COMPARE_ELEMENTS"
  | "SWAP"
  | "NO_SWAP"
  | "PASS_COMPLETE"
  | "SORT_FINISHED"
  // Search Events
  | "SEARCH_LEFT"
  | "SEARCH_RIGHT"
  | "FOUND"
  | "NOT_FOUND"
  // Graph Events
  | "VISIT_VERTEX"
  | "EXPLORE_EDGE"
  | "ENQUEUE"
  | "DEQUEUE"
  | "BACKTRACK"
  // Generic
  | "STEP";

export interface ISemanticEvent {
  stepIndex: number;
  type: SemanticEventType;
  description: string;
  payload: Record<string, any>;
}

// ============================================================
// BST NODE — reconstructed tree state at a given trace step
// ============================================================

export interface IBSTNodeState {
  id: string;
  val: number;
  leftId: string | null;
  rightId: string | null;
}

export interface IBSTSnapshot {
  rootId: string | null;
  nodes: Record<string, IBSTNodeState>;
  activeInsertVal: number | null;
  activeVisitId: string | null;
  semanticEvent: ISemanticEvent | null;
}

// ============================================================
// SEMANTIC EVENT ENGINE
// Processes the FULL execution trace and produces:
//   1. A BST snapshot (tree state) per step
//   2. A semantic event per step
// The renderer receives ONLY these. It never reads stack frames.
// ============================================================

export function buildBSTSnapshotsFromTrace(trace: ITraceEvent[]): IBSTSnapshot[] {
  if (!trace || trace.length === 0) return [];

  const snapshots: IBSTSnapshot[] = [];

  for (let idx = 0; idx < trace.length; idx++) {
    const step = trace[idx];

    // 1. Reconstruct BST state from heap objects at this step
    const nodes: Record<string, IBSTNodeState> = {};
    let rootId: string | null = null;

    // Find root reference from outermost module frame
    for (const frame of step.stack_frames) {
      const rootVar = frame.locals["root"];
      if (rootVar && rootVar.kind === "reference") {
        rootId = rootVar.target;
      }
    }

    // Build node map from heap
    Object.entries(step.heap_objects).forEach(([objId, obj]: [string, IHeapObject]) => {
      if (obj.kind === "object" && obj.fields) {
        const fieldKeys = Object.keys(obj.fields).map(k => k.toLowerCase());
        if (fieldKeys.includes("left") || fieldKeys.includes("right")) {
          const valField = obj.fields["val"] || obj.fields["value"] || obj.fields["key"] || obj.fields["data"];
          const numVal = valField && valField.kind === "primitive" ? Number(valField.value) : 0;

          const leftField = obj.fields["left"];
          const rightField = obj.fields["right"];

          nodes[objId] = {
            id: objId,
            val: numVal,
            leftId: leftField && leftField.kind === "reference" ? leftField.target : null,
            rightId: rightField && rightField.kind === "reference" ? rightField.target : null,
          };
        }
      }
    });

    // If no root found from locals, find the node that no other node points to
    if (!rootId && Object.keys(nodes).length > 0) {
      const childIds = new Set<string>();
      Object.values(nodes).forEach(n => {
        if (n.leftId) childIds.add(n.leftId);
        if (n.rightId) childIds.add(n.rightId);
      });
      for (const nid of Object.keys(nodes)) {
        if (!childIds.has(nid)) {
          rootId = nid;
          break;
        }
      }
    }

    // 2. Generate semantic event for this step
    const topFrame = step.stack_frames[step.stack_frames.length - 1];
    const funcName = topFrame?.function_name || "";
    const locals = topFrame?.locals || {};

    const insertingVal = locals["value"]?.kind === "primitive" ? Number(locals["value"].value) : null;

    let semanticEvent: ISemanticEvent | null = null;
    let activeVisitId: string | null = null;

    // Find current node being visited
    const currentRootLocal = locals["root"];
    if (currentRootLocal && currentRootLocal.kind === "reference" && nodes[currentRootLocal.target]) {
      activeVisitId = currentRootLocal.target;
    }

    const prevSnapshot = idx > 0 ? snapshots[idx - 1] : null;
    const prevNodeCount = prevSnapshot ? Object.keys(prevSnapshot.nodes).length : 0;
    const currentNodeCount = Object.keys(nodes).length;
    const newNodeCreated = currentNodeCount > prevNodeCount;

    if (funcName === "__init__" || newNodeCreated) {
      // A new node was just allocated
      const newVal = insertingVal ?? (newNodeCreated
        ? Object.values(nodes).find(n => !prevSnapshot?.nodes[n.id])?.val ?? null
        : null);

      semanticEvent = {
        stepIndex: idx,
        type: "CREATE_NODE",
        description: newVal !== null ? `Create Node(${newVal})` : "Create Node",
        payload: { nodeVal: newVal }
      };
    } else if (funcName.includes("insert") && insertingVal !== null) {
      if (activeVisitId && nodes[activeVisitId]) {
        const visitedNodeVal = nodes[activeVisitId].val;

        // Determine comparison result
        if (step.event_type === "line") {
          // Check which branch the code is taking
          const lineNum = step.line_number;
          const prevStep = idx > 0 ? trace[idx - 1] : null;

          // Emit VISIT_NODE first if we arrived at a new node
          if (!prevSnapshot?.activeVisitId || prevSnapshot.activeVisitId !== activeVisitId) {
            semanticEvent = {
              stepIndex: idx,
              type: "VISIT_NODE",
              description: `Visit Node(${visitedNodeVal})`,
              payload: { nodeVal: visitedNodeVal, nodeId: activeVisitId }
            };
          } else if (insertingVal < visitedNodeVal) {
            semanticEvent = {
              stepIndex: idx,
              type: "GO_LEFT",
              description: `${insertingVal} < ${visitedNodeVal} → Go Left`,
              payload: { insertVal: insertingVal, nodeVal: visitedNodeVal, decision: "left" }
            };
          } else {
            semanticEvent = {
              stepIndex: idx,
              type: "GO_RIGHT",
              description: `${insertingVal} > ${visitedNodeVal} → Go Right`,
              payload: { insertVal: insertingVal, nodeVal: visitedNodeVal, decision: "right" }
            };
          }
        }
      } else {
        // root is None — we're about to create a node
        semanticEvent = {
          stepIndex: idx,
          type: "CREATE_NODE",
          description: `NULL reached → Create Node(${insertingVal})`,
          payload: { nodeVal: insertingVal }
        };
      }
    } else if (step.event_type === "return" && funcName.includes("insert")) {
      // Link event — parent now has a new child
      semanticEvent = {
        stepIndex: idx,
        type: "LINK_LEFT",
        description: `Attach node to parent`,
        payload: { insertVal: insertingVal }
      };
    } else if (
      funcName.includes("inorder") ||
      funcName.includes("preorder") ||
      funcName.includes("postorder") ||
      funcName.includes("traverse") ||
      funcName.includes("search") ||
      funcName.includes("find")
    ) {
      // Tree traversal / search phase — highlight visited node
      if (activeVisitId && nodes[activeVisitId]) {
        const visitedVal = nodes[activeVisitId].val;
        semanticEvent = {
          stepIndex: idx,
          type: "VISIT_NODE",
          description: `${funcName}() → Visiting Node(${visitedVal})`,
          payload: { nodeVal: visitedVal, nodeId: activeVisitId, phase: funcName }
        };
      } else {
        // root is None (leaf null check)
        semanticEvent = {
          stepIndex: idx,
          type: "STEP",
          description: `${funcName}(None) → Base Case`,
          payload: { phase: funcName }
        };
      }
    }

    // Fallback
    if (!semanticEvent) {
      semanticEvent = {
        stepIndex: idx,
        type: "STEP",
        description: `${funcName || "execute"}() — Line ${step.line_number}`,
        payload: {}
      };
    }

    snapshots.push({
      rootId,
      nodes,
      activeInsertVal: insertingVal,
      activeVisitId,
      semanticEvent
    });
  }

  return snapshots;
}
