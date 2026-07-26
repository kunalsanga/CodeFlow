// Factual Runtime Execution Types for CodeFlow Engine

export interface IPrimitiveValue {
  kind: 'primitive';
  value: number | string | boolean | null;
  type: string;
}

export interface IReferenceValue {
  kind: 'reference';
  target: string;
  type: string;
}

export type IVariableValue = IPrimitiveValue | IReferenceValue;

export interface IStackFrame {
  frame_id: string;
  function_name: string;
  line_number: number;
  locals: Record<string, IVariableValue>;
}

export interface IHeapObject {
  id: string;
  kind: 'object' | 'list' | 'set' | 'dict';
  type_name: string;
  fields: Record<string, IVariableValue>;
  elements?: IVariableValue[];
}

export interface IMemoryTraceFrame {
  step_index: number;
  line_number: number;
  event_type: 'call' | 'line' | 'return' | 'exception';
  stack_frames: IStackFrame[];
  heap_objects: Record<string, IHeapObject>;
  stdout: string;
}
