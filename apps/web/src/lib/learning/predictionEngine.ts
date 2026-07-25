import { ITraceEvent } from "@/types/trace";
import { IPredictionQuestion } from "./types";

export function generatePredictionQuestions(trace: ITraceEvent[]): IPredictionQuestion[] {
  if (!trace || trace.length < 3) return [];

  const questions: IPredictionQuestion[] = [];

  trace.forEach((event, idx) => {
    // Generate prediction at step N for step N+1
    if (idx < trace.length - 1) {
      const nextEvent = trace[idx + 1];
      const nextFrame = nextEvent.stack_frames[nextEvent.stack_frames.length - 1];

      if (nextEvent.event_type === "call") {
        questions.push({
          id: `pred_${idx}`,
          stepIndex: idx,
          question: `What happens when line ${event.line_number} finishes executing?`,
          options: [
            `A new stack frame for \`${nextFrame?.function_name}()\` will be pushed`,
            "The program will terminate immediately",
            "Variable values will be deleted",
            "A memory overflow exception will be raised"
          ],
          correctIndex: 0,
          explanation: `Line ${event.line_number} invokes function \`${nextFrame?.function_name}()\`, pushing a new frame onto the call stack.`
        });
      } else if (nextEvent.event_type === "return") {
        questions.push({
          id: `pred_${idx}`,
          stepIndex: idx,
          question: `What occurs upon reaching line ${nextEvent.line_number}?`,
          options: [
            "The function completes and its stack frame is popped",
            "An infinite loop begins",
            "New variables are allocated on the heap",
            "No state change occurs"
          ],
          correctIndex: 0,
          explanation: `Line ${nextEvent.line_number} returns control to the caller frame and pops the current frame.`
        });
      }
    }
  });

  return questions;
}
