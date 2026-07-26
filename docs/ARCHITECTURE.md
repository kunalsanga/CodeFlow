# CodeFlow Algorithm Visualization Engine - Architecture Specification

## 1. Overview

CodeFlow is designed to be the world's best interactive algorithm visualization engine. Its core philosophy is to transform raw execution traces into educational semantic events that directly map to algorithm concepts, eliminating the need for students to mentally convert heap objects into algorithms.

> "Students should NEVER have to mentally convert heap objects into algorithms."

## 2. Core Architecture

### 2.1 Execution Trace
The raw execution trace provides the foundation with:
- Step index, line number, function name
- Stack frames, heap objects, local variables
- Standard output stream
- Event type (line, call, return, etc.)

### 2.2 Semantic Event Engine
Transforms raw trace into domain-specific semantic events:
- Extended semantic event types (over 140 types)
- Full event context with metadata
- Event bus for decoupled communication
- State reconstruction engine

### 2.3 Renderer Factory & Registry
Manages renderer plugins:
- Plugin discovery and registration
- Event routing based on semantic event types
- Initialization and lifecycle management
- Dependency injection for state engines

### 2.4 Animation Timeline
Coordinates the timing and sequencing of visual events:
- Smooth motion design (spring animations, fades, scales)
- Playback controls (step forward/back, auto play)
- Camera controls (zoom, pan, responsive layout)
- Performance optimization (virtual rendering, memoization)

### 2.5 Specialized Visualizers
Each algorithm has its dedicated visualization:
- Binary Search Tree
- Linked List
- Stack
- Queue
- Heap
- Trie
- Graph
- Binary Search
- Bubble Sort
- Merge Sort
- Quick Sort
- Dynamic Programming
- Union Find
- Segment Tree
- Fenwick Tree

## 3. Event-Driven Architecture

### 3.1 Semantic Event Types
All events inherit from `ExtendedSemanticEventType`:
- **Tree Operations**: CREATE_NODE, VISIT_NODE, GO_LEFT, GO_RIGHT
- **Sorting Events**: COMPARE, SWAP, MOVE_POINTER
- **Search Events**: SEARCH_FOUND, SEARCH_FAIL
- **Graph Events**: VISIT_VERTEX, EXPLORE_EDGE, ENQUEUE
- **Stack/Queue**: PUSH_STACK, POP_STACK, PEEK
- **Memory Events**: ALLOCATE, FREE, REFERENCE
- **Control Flow**: PUSH_FRAME, POP_FRAME, FUNCTION_CALLED
- **I/O Events**: PRINT, INPUT, OUTPUT

## 3.2 Renderer Requirements
Each renderer includes:
- Idle State & Animation State
- Current Step highlighting
- Highlighted Objects & Legend
- Semantic Banner & Explanation Panel
- Playback Controls (play/pause/step)
- Speed Control, Zoom, Pan
- Responsive Layout

## 3.3 Motion Design Principles
- Apple Keynote-inspired animations
- No sudden jumps
- Spring animations, opacity fades, scale effects
- Edge drawing, node creation, pointer movement
- Meaningful particle effects only

## 4. UI Design Philosophy
- Professional Dark Theme
- Modern Typography with rounded components
- Glassmorphism effects and soft shadows
- Gradient highlights
- Minimalist design - no clutter
- IDE + Figma hybrid aesthetic

## 5. Performance Requirements
- Support for 1000+ semantic events without frame drops
- Memoization of static data
- Incremental updates to avoid recomputation
- Virtual rendering for large state spaces

## 6. Development Constraints
- **DO NOT**: Render heap objects as primary UI
- **DO NOT**: Expose raw runtime references
- **DO NOT**: Detect algorithms inside React components
- **Avoid**: Duplicate code, giant components

## 7. Implementation Priority
1. Core semantic event engine (COMPLETED)
2. Renderer factory and registry 
3. Animation timeline with motion controls
4. Binary Search Tree visualizer
5. Linked List visualizer
6. Stack visualizer
7. Queue visualizer
8. Graph visualizer
9. Heap visualizer
10. Dynamic Programming visualizer

This specification serves as the comprehensive blueprint for building the world's best interactive algorithm visualization engine that transforms raw execution into educational, beautiful, and intuitive visualizations.