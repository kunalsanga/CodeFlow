import { IConceptCard } from "./types";

export const conceptLibrary: Record<string, IConceptCard> = {
  stack: {
    title: "Call Stack Memory",
    category: "Memory Architecture",
    memoryRepresentation: "LIFO (Last In, First Out) region of memory storing active stack frames, function return addresses, and local primitive variables.",
    realWorldAnalogy: "Like a stack of dinner plates: the last plate placed on top is the first one removed when a function returns.",
    interviewTip: "Stack allocation is fast O(1) and contiguous, but has limited fixed size (leading to RecursionError / StackOverflow).",
    commonMistake: "Assuming large lists or objects live on the stack; stack frames only store reference addresses targeting heap memory."
  },
  heap: {
    title: "Heap Memory",
    category: "Memory Architecture",
    memoryRepresentation: "Dynamic, unstructured memory region storing reference objects, dictionaries, lists, and custom class instances.",
    realWorldAnalogy: "Like a warehouse with labeled storage bins: objects can be allocated anywhere, and variable pointers act as shipping addresses.",
    interviewTip: "Objects on the heap persist as long as at least one stack or global variable reference points to them.",
    commonMistake: "Creating dangling references or cyclic object references that waste memory if not garbage collected."
  }
};
