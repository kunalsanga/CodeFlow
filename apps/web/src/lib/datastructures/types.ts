export type DataStructureType =
  | "LINKED_LIST"
  | "BINARY_TREE"
  | "GRAPH"
  | "QUEUE"
  | "STACK"
  | "GENERIC";

export interface IDataStructureInfo {
  type: DataStructureType;
  rootObjId?: string;
  metadata?: Record<string, any>;
}
