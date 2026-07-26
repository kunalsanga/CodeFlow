# Contributing to CodeFlow

Thank you for your interest in contributing to **CodeFlow**! We welcome contributions from the open-source community to build the ultimate code execution and algorithm visualization platform.

## Architecture Overview

CodeFlow is structured as a modular monorepo:

- `apps/web`: Next.js 14 Web Studio interface.
- `packages/types`: Shared TypeScript interfaces (`ISemanticIRv1`, `ICodeFlowPlugin`).
- `packages/execution-engine`: Factual runtime memory interpreter.
- `packages/semantic-engine`: Algorithm classifier and Knowledge Graph.
- `packages/layout-engine`: Tree & Graph layout algorithms.
- `packages/animation-engine`: Standardized Framer Motion animation primitives.
- `packages/plugin-registry`: Plugin registry for educational visualizer plugins.
- `packages/ai-engine`: Step-by-step educational rationale generator.
- `services/backend`: Python trace execution runner.

## How to Contribute

1. **Fork & Clone** the repository.
2. **Install Dependencies**:
   ```bash
   cd apps/web && npm install
   ```
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```
4. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/my-new-algorithm-plugin
   ```
5. **Add a Visualizer Plugin**:
   To add a new data structure or algorithm visualization, add a self-contained plugin registering:
   - Plugin ID & Metadata (Time/Space complexity)
   - Step Rationale Generator
   - Specialized Renderer Component
6. **Submit a Pull Request**!
