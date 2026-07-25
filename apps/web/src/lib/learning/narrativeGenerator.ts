import { ITraceEvent } from "@/types/trace";
import { IExecutionStoryStep } from "./types";

export function generateExecutionStory(trace: ITraceEvent[]): IExecutionStoryStep[] {
  if (!trace || trace.length === 0) return [];

  const story: IExecutionStoryStep[] = [];

  trace.forEach((event, idx) => {
    const stepNum = idx + 1;
    const topFrame = event.stack_frames[event.stack_frames.length - 1];
    const funcName = topFrame?.function_name || "<module>";

    let title = `Step ${stepNum}: Line ${event.line_number}`;
    let narrative = `Executed line ${event.line_number} in scope \`${funcName}\`.`;
    let conceptTag: IExecutionStoryStep["conceptTag"] = "Initialization";

    if (event.event_type === "call") {
      title = `Step ${stepNum}: Function Call \`${funcName}()\``;
      narrative = `Function \`${funcName}\` was invoked and a new stack frame was allocated.`;
      conceptTag = "Stack Push";
    } else if (event.event_type === "return") {
      title = `Step ${stepNum}: Return from \`${funcName}()\``;
      narrative = `Execution finished in \`${funcName}\`. Frame popped from call stack.`;
      conceptTag = "Return";
    } else if (Object.keys(topFrame?.locals || {}).length > 0) {
      const varsStr = Object.entries(topFrame.locals)
        .map(([k, v]) => `${k}=${v.kind === "primitive" ? v.value : "ref"}`)
        .join(", ");
      narrative = `Line ${event.line_number} evaluated. Current active variables: ${varsStr}.`;
      conceptTag = "Mutation";
    }

    story.push({
      stepIndex: idx,
      title,
      narrative,
      conceptTag
    });
  });

  return story;
}
