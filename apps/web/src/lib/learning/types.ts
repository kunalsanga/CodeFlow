export interface IPredictionQuestion {
  id: string;
  stepIndex: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface IExecutionStoryStep {
  stepIndex: number;
  title: string;
  narrative: string;
  conceptTag: "Initialization" | "Loop Iteration" | "Comparison" | "Mutation" | "Stack Push" | "Return";
}

export interface IConceptCard {
  title: string;
  category: string;
  memoryRepresentation: string;
  realWorldAnalogy: string;
  interviewTip: string;
  commonMistake: string;
}
