export interface ICodeExecutionRequest {
  language: string;
  code: string;
  max_steps?: number;
}

export interface IAIExplanationResponse {
  step_index: number;
  explanation: string;
  key_takeaway: string;
}
