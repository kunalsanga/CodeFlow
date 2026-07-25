import { ArrayRenderer } from "./ArrayRenderer";
import { DictionaryRenderer } from "./DictionaryRenderer";
import { ObjectRenderer } from "./ObjectRenderer";
import { StackFrameRenderer } from "./StackFrameRenderer";
import { LinkedListRenderer } from "./LinkedListRenderer";
import { TreeRenderer } from "./TreeRenderer";

export const customNodeTypes = {
  stackNode: StackFrameRenderer,
  arrayNode: ArrayRenderer,
  dictNode: DictionaryRenderer,
  objectNode: ObjectRenderer,
  linkedListNode: LinkedListRenderer,
  treeNode: TreeRenderer
};
