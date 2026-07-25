export type ValueKind = "primitive" | "reference" | "sequence" | "mapping" | "object";

export interface IPrimitiveValue {
  kind: "primitive";
  type: string;
  value: number | string | boolean | null;
}

export interface IReferenceValue {
  kind: "reference";
  type: string;
  target: string; // obj_id
}

export type IVariableValue = IPrimitiveValue | IReferenceValue;

export interface IStackFrame {
  frame_id: string;
  function_name: string;
  line_number: number;
  locals: Record<string, IVariableValue>;
}

export interface IHeapSequenceObject {
  kind: "sequence";
  type: string;
  value: IVariableValue[];
}

export interface IHeapMappingObject {
  kind: "mapping";
  type: string;
  value: Record<string, IVariableValue>;
}

export interface IHeapCustomObject {
  kind: "object";
  type: string;
  fields: Record<string, IVariableValue>;
  repr?: string;
}

export type IHeapObject = IHeapSequenceObject | IHeapMappingObject | IHeapCustomObject;

export interface ITraceEvent {
  step_index: number;
  event_type: "line" | "call" | "return";
  line_number: number;
  stack_frames: IStackFrame[];
  heap_objects: Record<string, IHeapObject>;
  stdout: string;
}

export interface IExecutionPayload {
  status: "success" | "error";
  total_steps: number;
  trace: ITraceEvent[];
  stdout: string;
  error?: string;
}
