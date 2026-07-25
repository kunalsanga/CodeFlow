import { ITraceEvent } from "@/types/trace";

export type SemanticEventType =
  | "VISIT_NODE"
  | "COMPARE"
  | "GO_LEFT"
  | "GO_RIGHT"
  | "CREATE_NODE"
  | "ATTACH_LEFT"
  | "ATTACH_RIGHT"
  | "SWAP"
  | "NO_SWAP"
  | "ENQUEUE"
  | "DEQUEUE";

export interface ISemanticEvent {
  stepIndex: number;
  type: SemanticEventType;
  description: string;
  payload: {
    nodeVal?: number;
    compareVal?: number;
    targetVal?: number;
    decision?: string;
    nodeId?: string;
  };
}

export function generateSemanticEventStream(trace: ITraceEvent[]): ISemanticEvent[] {
  if (!trace || trace.length === 0) return [];

  const events: ISemanticEvent[] = [];

  trace.forEach((step, idx) => {
    const topFrame = step.stack_frames[step.stack_frames.length - 1];
    const funcName = topFrame?.function_name || "";
    const locals = topFrame?.locals || {};

    const valToInsert = locals["value"]?.kind === "primitive" ? Number(locals["value"].value) : null;
    const rootVal = locals["root"]?.kind === "primitive" ? Number(locals["root"].value) : null;

    if (funcName.includes("insert") && valToInsert !== null) {
      if (step.line_number === 8 || step.line_number === 9) {
        events.push({
          stepIndex: idx,
          type: "CREATE_NODE",
          description: `CREATE_NODE(${valToInsert})`,
          payload: { nodeVal: valToInsert, decision: "Create Node & Return" }
        });
      } else if (step.line_number === 11 || step.line_number === 12) {
        events.push({
          stepIndex: idx,
          type: "GO_LEFT",
          description: `COMPARE(${valToInsert} < ${rootVal}) → GO_LEFT`,
          payload: { nodeVal: valToInsert, compareVal: rootVal ?? undefined, decision: "Go Left ←" }
        });
      } else if (step.line_number === 13 || step.line_number === 14) {
        events.push({
          stepIndex: idx,
          type: "GO_RIGHT",
          description: `COMPARE(${valToInsert} > ${rootVal}) → GO_RIGHT`,
          payload: { nodeVal: valToInsert, compareVal: rootVal ?? undefined, decision: "Go Right →" }
        });
      }
    }
  });

  return events;
}
