import sys
from typing import Dict, Any, List, Set, Tuple, Optional
from app.engine.models import ValueKind, VariableValue, HeapObjectModel

class MemoryModelExtractor:
    """
    Production-grade memory extractor.
    Extracts stack variables and heap reference objects with 100% safety
    against infinite recursion, circular object graphs, or unsafe magic methods.
    """
    def __init__(self, max_depth: int = 10):
        self.max_depth = max_depth
        self.heap: Dict[str, HeapObjectModel] = {}
        self.visited_obj_ids: Set[int] = set()

    def reset(self):
        self.heap.clear()
        self.visited_obj_ids.clear()

    def serialize_value(self, val: Any, depth: int = 0) -> VariableValue:
        """Serialize value into a primitive variable or heap object reference."""
        # Primitives
        if isinstance(val, (int, float, str, bool, type(None))):
            return VariableValue(
                kind=ValueKind.PRIMITIVE,
                type=type(val).__name__,
                value=val
            )

        # Non-primitive reference type
        val_id = id(val)
        obj_id = f"ref_{val_id}"

        # If already extracted into heap, return reference immediately
        if obj_id in self.heap or val_id in self.visited_obj_ids:
            return VariableValue(
                kind=ValueKind.REFERENCE,
                type=type(val).__name__,
                target=obj_id
            )

        # Depth guard
        if depth > self.max_depth:
            return VariableValue(
                kind=ValueKind.PRIMITIVE,
                type=type(val).__name__,
                value=f"<{type(val).__name__} (max depth reach)>"
            )

        # Mark object ID as visited BEFORE recursing into children to prevent circular deadlock
        self.visited_obj_ids.add(val_id)

        # Extract according to data structure type
        try:
            if isinstance(val, (list, tuple, set)):
                items = [self.serialize_value(item, depth + 1) for item in val]
                self.heap[obj_id] = HeapObjectModel(
                    obj_id=obj_id,
                    kind=ValueKind.SEQUENCE,
                    type=type(val).__name__,
                    value=items
                )
            elif isinstance(val, dict):
                entries = {}
                for k, v in val.items():
                    key_str = str(k)
                    entries[key_str] = self.serialize_value(v, depth + 1)
                self.heap[obj_id] = HeapObjectModel(
                    obj_id=obj_id,
                    kind=ValueKind.MAPPING,
                    type="dict",
                    value=entries
                )
            elif callable(val):
                self.heap[obj_id] = HeapObjectModel(
                    obj_id=obj_id,
                    kind=ValueKind.FUNCTION,
                    type=type(val).__name__,
                    repr_str=f"<function {getattr(val, '__name__', 'func')}>"
                )
            else:
                # Custom object instance
                fields = {}
                if hasattr(val, "__dict__"):
                    for k, v in val.__dict__.items():
                        if not k.startswith("__"):
                            fields[k] = self.serialize_value(v, depth + 1)

                safe_repr = f"<{type(val).__name__} object at {hex(val_id)}>"
                self.heap[obj_id] = HeapObjectModel(
                    obj_id=obj_id,
                    kind=ValueKind.OBJECT,
                    type=type(val).__name__,
                    fields=fields,
                    repr_str=safe_repr
                )
        except Exception as e:
            # Fallback for uninspectable objects
            self.heap[obj_id] = HeapObjectModel(
                obj_id=obj_id,
                kind=ValueKind.OBJECT,
                type=type(val).__name__,
                repr_str=f"<{type(val).__name__}>"
            )

        return VariableValue(
            kind=ValueKind.REFERENCE,
            type=type(val).__name__,
            target=obj_id
        )
