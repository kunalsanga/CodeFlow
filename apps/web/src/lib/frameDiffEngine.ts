import { ITraceEvent, IStackFrame, IHeapObject, IVariableValue } from "@/types/trace";

export type VariableChangeType = "created" | "updated" | "deleted";

export interface IVariableDiff {
  name: string;
  changeType: VariableChangeType;
  oldValue?: string;
  newValue?: string;
}

export interface IHeapNodeDiff {
  objId: string;
  changeType: "allocated" | "mutated" | "destroyed";
  changedIndices?: number[];
  changedKeys?: string[];
  changedFields?: string[];
}

export interface IStackDiff {
  type: "push" | "pop" | "none";
  frameName?: string;
}

export interface IFrameDiffResult {
  changedVariables: Record<string, IVariableDiff>;
  changedHeapNodes: Record<string, IHeapNodeDiff>;
  stackDiff: IStackDiff;
  consoleDelta: string;
  educationalSummaries: string[];
}

export function computeFrameDiff(
  prevEvent: ITraceEvent | null,
  currEvent: ITraceEvent | null
): IFrameDiffResult {
  const result: IFrameDiffResult = {
    changedVariables: {},
    changedHeapNodes: {},
    stackDiff: { type: "none" },
    consoleDelta: "",
    educationalSummaries: []
  };

  if (!currEvent) return result;

  const currTopFrame = currEvent.stack_frames[currEvent.stack_frames.length - 1];
  const prevTopFrame = prevEvent?.stack_frames[prevEvent.stack_frames.length - 1];

  // 1. Compute Stack Push / Pop Diff
  const prevStackLen = prevEvent?.stack_frames.length || 0;
  const currStackLen = currEvent.stack_frames.length;

  if (currStackLen > prevStackLen) {
    result.stackDiff = { type: "push", frameName: currTopFrame?.function_name };
    result.educationalSummaries.push(
      `Pushed new frame \`${currTopFrame?.function_name}()\` onto stack (Line ${currEvent.line_number}).`
    );
  } else if (currStackLen < prevStackLen) {
    result.stackDiff = { type: "pop", frameName: prevTopFrame?.function_name };
    result.educationalSummaries.push(
      `Popped frame \`${prevTopFrame?.function_name}()\` from stack.`
    );
  }

  // 2. Compute Variable Diffs (Current Top Frame)
  if (currTopFrame) {
    const currLocals = currTopFrame.locals;
    const prevLocals = prevTopFrame?.locals || {};

    Object.entries(currLocals).forEach(([varName, currVal]) => {
      const prevVal = prevLocals[varName];
      const currStr = formatVarValue(currVal);

      if (!prevVal) {
        result.changedVariables[varName] = {
          name: varName,
          changeType: "created",
          newValue: currStr
        };
        result.educationalSummaries.push(
          `Created variable \`${varName}\` = ${currStr}`
        );
      } else {
        const prevStr = formatVarValue(prevVal);
        if (prevStr !== currStr) {
          result.changedVariables[varName] = {
            name: varName,
            changeType: "updated",
            oldValue: prevStr,
            newValue: currStr
          };
          result.educationalSummaries.push(
            `Updated \`${varName}\`: ${prevStr} → ${currStr}`
          );
        }
      }
    });
  }

  // 3. Compute Heap Object Diffs
  const currHeap = currEvent.heap_objects;
  const prevHeap = prevEvent?.heap_objects || {};

  Object.entries(currHeap).forEach(([objId, currObj]) => {
    const prevObj = prevHeap[objId];

    if (!prevObj) {
      result.changedHeapNodes[objId] = {
        objId,
        changeType: "allocated"
      };
      result.educationalSummaries.push(`Allocated new ${currObj.type} in heap memory.`);
    } else {
      // Sequence Diff (List / Array)
      if (currObj.kind === "sequence" && prevObj.kind === "sequence") {
        const changedIndices: number[] = [];
        currObj.value.forEach((val, idx) => {
          const prevVal = prevObj.value[idx];
          if (!prevVal || formatVarValue(val) !== formatVarValue(prevVal)) {
            changedIndices.push(idx);
          }
        });

        if (changedIndices.length > 0) {
          result.changedHeapNodes[objId] = {
            objId,
            changeType: "mutated",
            changedIndices
          };
          result.educationalSummaries.push(
            `Mutated list elements at indices [${changedIndices.join(", ")}]`
          );
        }
      }
      // Mapping Diff (Dictionary)
      else if (currObj.kind === "mapping" && prevObj.kind === "mapping") {
        const changedKeys: string[] = [];
        Object.entries(currObj.value).forEach(([k, val]) => {
          const prevVal = prevObj.value[k];
          if (!prevVal || formatVarValue(val) !== formatVarValue(prevVal)) {
            changedKeys.push(k);
          }
        });

        if (changedKeys.length > 0) {
          result.changedHeapNodes[objId] = {
            objId,
            changeType: "mutated",
            changedKeys
          };
          result.educationalSummaries.push(
            `Updated dict keys: ${changedKeys.map(k => `"${k}"`).join(", ")}`
          );
        }
      }
      // Object Fields Diff
      else if (currObj.kind === "object" && prevObj.kind === "object") {
        const changedFields: string[] = [];
        Object.entries(currObj.fields).forEach(([fName, val]) => {
          const prevVal = prevObj.fields[fName];
          if (!prevVal || formatVarValue(val) !== formatVarValue(prevVal)) {
            changedFields.push(fName);
          }
        });

        if (changedFields.length > 0) {
          result.changedHeapNodes[objId] = {
            objId,
            changeType: "mutated",
            changedFields
          };
          result.educationalSummaries.push(
            `Updated instance attributes: ${changedFields.join(", ")}`
          );
        }
      }
    }
  });

  // 4. Console Output Diff
  const prevStdout = prevEvent?.stdout || "";
  const currStdout = currEvent.stdout || "";

  if (currStdout.length > prevStdout.length) {
    const delta = currStdout.slice(prevStdout.length).trim() ? currStdout.slice(prevStdout.length) : currStdout;
    result.consoleDelta = delta;
    result.educationalSummaries.push(`Printed to console: ${delta.trim()}`);
  }

  return result;
}

function formatVarValue(val: IVariableValue): string {
  if (val.kind === "primitive") return String(val.value);
  return `ref ${val.target}`;
}
