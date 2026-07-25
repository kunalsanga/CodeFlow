"use client";

import React from "react";
import { ArrayRenderer } from "./ArrayRenderer";
import { DictionaryRenderer } from "./DictionaryRenderer";
import { ObjectRenderer } from "./ObjectRenderer";
import { StackFrameRenderer } from "./StackFrameRenderer";

export const customNodeTypes = {
  stackNode: StackFrameRenderer,
  arrayNode: ArrayRenderer,
  dictNode: DictionaryRenderer,
  objectNode: ObjectRenderer
};
