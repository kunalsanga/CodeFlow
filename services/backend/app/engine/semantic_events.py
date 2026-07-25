#!/usr/bin/env python3
"""
Semantic Event Engine - Core of the Compiler-Inspired Architecture

This module provides the event bus, semantic event types, and state
reconstruction engine that powers the visualization pipeline.
"""

import sys
import time
import inspect
from typing import List, Dict, Any, Optional, Union, Callable
from enum import Enum, auto
from dataclasses import dataclass, field
from collections import defaultdict
from abc import ABC, abstractmethod

from app.engine.models import (
    TimelineFrameModel,
    SemanticEventModel,
    SemanticEventType,
    VariableValue,
    HeapObjectModel,
    StackFrameModel
)
from app.engine.memory_model import MemoryModelExtractor
from app.engine.event_system import EventDetector


# ============================================================================
# EXTENDED SEMANTIC EVENT TYPES
# ============================================================================

class ExtendedSemanticEventType(str, Enum):
    """Extended semantic event types for all DSA operations"""

    # Control Flow
    PUSH_FRAME = "PUSH_FRAME"
    POP_FRAME = "POP_FRAME"
    FUNCTION_CALLED = "FUNCTION_CALLED"
    FUNCTION_RETURNED = "FUNCTION_RETURNED"
    RETURN = "RETURN"

    # Memory Management
    ALLOCATE = "ALLOCATE"
    FREE = "FREE"
    REFERENCE = "REFERENCE"

    # Tree Operations
    CREATE_NODE = "CREATE_NODE"
    DELETE_NODE = "DELETE_NODE"
    VISIT_NODE = "VISIT_NODE"
    GO_LEFT = "GO_LEFT"
    GO_RIGHT = "GO_RIGHT"
    GO_PARENT = "GO_PARENT"
    TRAVERSE_EDGE = "TRAVERSE_EDGE"
    ROTATE_LEFT = "ROTATE_LEFT"
    ROTATE_RIGHT = "ROTATE_RIGHT"

    # Sorting Operations
    COMPARE = "COMPARE"
    SWAP = "SWAP"
    SET_VARIABLE = "SET_VARIABLE"
    GET_VARIABLE = "GET_VARIABLE"
    MOVE_POINTER = "MOVE_POINTER"

    # Search Operations
    SEARCH_FOUND = "SEARCH_FOUND"
    SEARCH_FAIL = "SEARCH_FAIL"
    MOVE_LOW = "MOVE_LOW"
    MOVE_HIGH = "MOVE_HIGH"
    MOVE_MID = "MOVE_MID"

    # Graph Operations
    INSERT = "INSERT"
    DELETE = "DELETE"
    MERGE = "MERGE"
    SPLIT = "SPLIT"
    ENQUEUE = "ENQUEUE"
    DEQUEUE = "DEQUEUE"
    BACKTRACK = "BACKTRACK"

    # Stack Operations
    PUSH_STACK = "PUSH_STACK"
    POP_STACK = "POP_STACK"

    # I/O Operations
    PRINT = "PRINT"
    INPUT = "INPUT"
    OUTPUT = "OUTPUT"

    # Generic
    STEP = "STEP"
    PROGRAM_FINISHED = "PROGRAM_FINISHED"


# ============================================================================
# EVENT MODEL
# ============================================================================

@dataclass
class SemanticEvent:
    """Core semantic event model with full context"""
    event_type: ExtendedSemanticEventType
    timestamp: float
    step: int
    line_number: int
    description: str
    metadata: Dict[str, Any] = field(default_factory=dict)
    scope: str = ""
    memory_references: List[str] = field(default_factory=list)
    object_ids: List[str] = field(default_factory=list)
    related_variables: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "event_type": self.event_type.value,
            "timestamp": self.timestamp,
            "step": self.step,
            "line_number": self.line_number,
            "description": self.description,
            "metadata": self.metadata,
            "scope": self.scope,
            "memory_references": self.memory_references,
            "object_ids": self.object_ids,
            "related_variables": self.related_variables
        }


# ============================================================================
# EVENT BUS
# ============================================================================

class EventBus:
    """
    Central event bus for publishing and subscribing to semantic events.
    All renderers and state engines subscribe to this bus.
    """

    def __init__(self):
        self._listeners: Dict[ExtendedSemanticEventType, List[Callable]] = defaultdict(list)
        self._event_history: List[SemanticEvent] = []
        self._current_event: Optional[SemanticEvent] = None
        self._is_processing: bool = False

    def subscribe(self, event_type: ExtendedSemanticEventType, callback: Callable):
        """Subscribe to events of a specific type"""
        self._listeners[event_type].append(callback)

    def unsubscribe(self, event_type: ExtendedSemanticEventType, callback: Callable):
        """Unsubscribe from events of a specific type"""
        if callback in self._listeners[event_type]:
            self._listeners[event_type].remove(callback)

    def publish(self, event: SemanticEvent):
        """Publish an event to all subscribers"""
        self._current_event = event
        self._event_history.append(event)

        # Notify all listeners for this event type
        for callback in self._listeners.get(event.event_type, []):
            try:
                callback(event)
            except Exception as e:
                print(f"Error in event listener: {e}")

    def get_current_event(self) -> Optional[SemanticEvent]:
        """Get the most recently published event"""
        return self._current_event

    def get_event_history(self) -> List[SemanticEvent]:
        """Get all events in order"""
        return self._event_history.copy()

    def clear_history(self):
        """Clear event history"""
        self._event_history.clear()
        self._current_event = None


# ============================================================================
# STATE RECONSTRUCTION ENGINE
# ============================================================================

class StateEngine:
    """
    Reconstructs runtime state from the event stream.
    Maintains heap, stack, variables, references, and pointers.
    """

    def __init__(self, event_bus: EventBus):
        self.event_bus = event_bus
        self.heap: Dict[str, Dict[str, Any]] = {}
        self.stack: List[Dict[str, Any]] = []
        self.variables: Dict[str, Any] = {}
        self.references: Dict[str, str] = {}  # object_id -> target_id
        self.pointers: Dict[str, str] = {}  # ptr_name -> object_id
        self.call_depth: int = 0
        self.object_counter: int = 0

        # Subscribe to relevant events
        self._subscribe_to_events()

    def _subscribe_to_events(self):
        """Subscribe to all relevant semantic events"""
        self.event_bus.subscribe(ExtendedSemanticEventType.ALLOCATE, self._on_allocate)
        self.event_bus.subscribe(ExtendedSemanticEventType.FREE, self._on_free)
        self.event_bus.subscribe(ExtendedSemanticEventType.REFERENCE, self._on_reference)
        self.event_bus.subscribe(ExtendedSemanticEventType.PUSH_FRAME, self._on_push_frame)
        self.event_bus.subscribe(ExtendedSemanticEventType.POP_FRAME, self._on_pop_frame)
        self.event_bus.subscribe(ExtendedSemanticEventType.SET_VARIABLE, self._on_set_variable)
        self.event_bus.subscribe(ExtendedSemanticEventType.CREATE_NODE, self._on_create_node)
        self.event_bus.subscribe(ExtendedSemanticEventType.VISIT_NODE, self._on_visit_node)

    def _generate_object_id(self) -> str:
        """Generate a unique object ID"""
        self.object_counter += 1
        return f"obj_{self.object_counter}"

    def _on_allocate(self, event: SemanticEvent):
        """Handle allocation events"""
        obj_id = event.metadata.get("object_id", self._generate_object_id())
        obj_type = event.metadata.get("type", "unknown")

        self.heap[obj_id] = {
            "id": obj_id,
            "type": obj_type,
            "created_at_step": event.step,
            "fields": {}
        }

        if "object_ids" in event.metadata:
            event.memory_references.append(obj_id)

    def _on_free(self, event: SemanticEvent):
        """Handle free events"""
        obj_id = event.metadata.get("object_id")
        if obj_id and obj_id in self.heap:
            del self.heap[obj_id]

        if obj_id and obj_id in self.references.values():
            # Clean up references pointing to freed object
            keys_to_remove = [k for k, v in self.references.items() if v == obj_id]
            for k in keys_to_remove:
                del self.references[k]

    def _on_reference(self, event: SemanticEvent):
        """Handle reference events"""
        ref_name = event.metadata.get("reference_name")
        target_id = event.metadata.get("target_id")

        if ref_name and target_id:
            self.references[ref_name] = target_id

    def _on_push_frame(self, event: SemanticEvent):
        """Handle frame push events"""
        self.stack.append({
            "function": event.metadata.get("function_name", "unknown"),
            "step": event.step,
            "variables": {}
        })
        self.call_depth += 1

    def _on_pop_frame(self, event: SemanticEvent):
        """Handle frame pop events"""
        if self.stack:
            self.stack.pop()
        self.call_depth = max(0, self.call_depth - 1)

    def _on_set_variable(self, event: SemanticEvent):
        """Handle variable set events"""
        var_name = event.metadata.get("variable_name")
        var_value = event.metadata.get("value")

        if var_name:
            self.variables[var_name] = var_value

    def _on_create_node(self, event: SemanticEvent):
        """Handle node creation events for trees"""
        node_id = self._generate_object_id()
        node_value = event.metadata.get("node_value")

        self.heap[node_id] = {
            "id": node_id,
            "type": "TreeNode",
            "value": node_value,
            "left": None,
            "right": None,
            "created_at_step": event.step
        }

        # Update event with the created object ID
        event.object_ids.append(node_id)
        event.memory_references.append(node_id)

    def _on_visit_node(self, event: SemanticEvent):
        """Handle node visit events"""
        node_id = event.metadata.get("node_id")
        if node_id:
            event.memory_references.append(node_id)

    def get_state_snapshot(self) -> Dict[str, Any]:
        """Get the current reconstructed state"""
        return {
            "heap": self.heap.copy(),
            "stack": self.stack.copy(),
            "variables": self.variables.copy(),
            "references": self.references.copy(),
            "call_depth": self.call_depth
        }

    def get_nodes_for_tree(self) -> Dict[str, Dict[str, Any]]:
        """Get all tree nodes from the heap"""
        return {
            obj_id: obj_data
            for obj_id, obj_data in self.heap.items()
            if obj_data.get("type") == "TreeNode"
        }


# ============================================================================
# RENDERER PLUGIN INTERFACE
# ============================================================================

class RendererPlugin(ABC):
    """Abstract base class for renderer plugins"""

    @property
    @abstractmethod
    def name(self) -> str:
        """Unique name for this renderer"""
        pass

    @property
    @abstractmethod
    def supported_events(self) -> List[ExtendedSemanticEventType]:
        """List of semantic events this renderer subscribes to"""
        pass

    @property
    @abstractmethod
    def required_state(self) -> List[str]:
        """List of state components required by this renderer"""
        pass

    @abstractmethod
    def initialize(self, event_bus: EventBus, state_engine: StateEngine):
        """Initialize the renderer with event bus and state engine"""
        pass

    @abstractmethod
    def render(self, state_snapshot: Dict[str, Any]) -> Any:
        """Render the current state"""
        pass

    @abstractmethod
    def on_event(self, event: SemanticEvent):
        """Handle a semantic event"""
        pass


# ============================================================================
# RENDERER REGISTRY
# ============================================================================

class RendererRegistry:
    """
    Registry for all renderer plugins.
    Manages plugin lifecycle and event routing.
    """

    def __init__(self):
        self._plugins: Dict[str, RendererPlugin] = {}
        self._event_bus: Optional[EventBus] = None
        self._state_engine: Optional[StateEngine] = None

    def register(self, plugin: RendererPlugin):
        """Register a renderer plugin"""
        self._plugins[plugin.name] = plugin

    def unregister(self, name: str) -> bool:
        """Unregister a renderer plugin"""
        if name in self._plugins:
            del self._plugins[name]
            return True
        return False

    def initialize_all(self, event_bus: EventBus, state_engine: StateEngine):
        """Initialize all registered plugins"""
        self._event_bus = event_bus
        self._state_engine = state_engine

        for plugin in self._plugins.values():
            plugin.initialize(event_bus, state_engine)

            # Subscribe to required events
            for event_type in plugin.supported_events:
                event_bus.subscribe(event_type, plugin.on_event)

    def get_plugins_for_event(self, event_type: ExtendedSemanticEventType) -> List[RendererPlugin]:
        """Get all plugins that handle a specific event type"""
        return [
            plugin for plugin in self._plugins.values()
            if event_type in plugin.supported_events
        ]

    def get_all_plugins(self) -> List[RendererPlugin]:
        """Get all registered plugins"""
        return list(self._plugins.values())


# ============================================================================
# SEMANTIC EVENT GENERATOR
# ============================================================================

class SemanticEventGenerator:
    """
    Transforms trace data into semantic events.
    This is the bridge between raw execution and visualization.
    """

    def __init__(self, event_bus: EventBus):
        self.event_bus = event_bus
        self.step_counter: int = 0
        self.start_time: float = 0.0

    def generate_events_from_trace(self, trace_data: List[Dict]) -> List[SemanticEvent]:
        """Generate semantic events from trace data"""
        self.step_counter = 0
        self.start_time = time.time()
        events = []

        for trace_frame in trace_data:
            self.step_counter += 1
            timestamp = time.time() - self.start_time

            # Analyze trace and generate events
            frame_events = self._analyze_trace_frame(trace_frame, timestamp)

            for event in frame_events:
                self.event_bus.publish(event)
                events.append(event)

        return events

    def _analyze_trace_frame(self, trace_frame: Dict, timestamp: float) -> List[SemanticEvent]:
        """Analyze a single trace frame and generate semantic events"""
        events = []

        event_type = trace_frame.get("event_type", "")
        line_num = trace_frame.get("line_number", 0)
        func_name = trace_frame.get("function_name", "")
        locals_data = trace_frame.get("locals", {})
        heap_data = trace_frame.get("heap_objects", {})
        stack_data = trace_frame.get("stack_frames", [])

        # Generate function events
        if event_type == "call":
            events.append(SemanticEvent(
                event_type=ExtendedSemanticEventType.FUNCTION_CALLED,
                timestamp=timestamp,
                step=self.step_counter,
                line_number=line_num,
                description=f"Function {func_name} called",
                metadata={"function_name": func_name},
                scope=func_name
            ))

        elif event_type == "return":
            events.append(SemanticEvent(
                event_type=ExtendedSemanticEventType.FUNCTION_RETURNED,
                timestamp=timestamp,
                step=self.step_counter,
                line_number=line_num,
                description=f"Function {func_name} returned",
                metadata={"function_name": func_name},
                scope=func_name
            ))

        # Generate variable events
        for var_name, var_data in locals_data.items():
            if var_data.get("kind") == "primitive":
                events.append(SemanticEvent(
                    event_type=ExtendedSemanticEventType.SET_VARIABLE,
                    timestamp=timestamp,
                    step=self.step_counter,
                    line_number=line_num,
                    description=f"Variable {var_name} = {var_data.get('value')}",
                    metadata={
                        "variable_name": var_name,
                        "value": var_data.get("value")
                    },
                    scope=func_name
                ))

        # Generate memory events for heap objects
        for obj_id, obj_data in heap_data.items():
            if obj_data.get("type") == "TreeNode":
                events.append(SemanticEvent(
                    event_type=ExtendedSemanticEventType.CREATE_NODE,
                    timestamp=timestamp,
                    step=self.step_counter,
                    line_number=line_num,
                    description=f"TreeNode({obj_data.get('value', 'unknown')}) created",
                    metadata={
                        "node_value": obj_data.get("value", "unknown"),
                        "node_id": obj_id
                    },
                    scope=func_name,
                    object_ids=[obj_id],
                    memory_references=[obj_id]
                ))

        # Fallback step event
        events.append(SemanticEvent(
            event_type=ExtendedSemanticEventType.STEP,
            timestamp=timestamp,
            step=self.step_counter,
            line_number=line_num,
            description=f"Step {self.step_counter} at line {line_num}",
            metadata={},
            scope=func_name
        ))

        return events