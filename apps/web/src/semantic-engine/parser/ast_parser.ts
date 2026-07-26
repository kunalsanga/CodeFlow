// Language-Independent AST Normalizer and Parser Interface for CodeFlow
// Parses multi-language code (Python, JS/TS, C++, Java) into a canonical AST representation

export type ASTNodeType =
  | 'Program'
  | 'ClassDeclaration'
  | 'FunctionDeclaration'
  | 'VariableDeclaration'
  | 'FieldAccess'
  | 'ArrayAccess'
  | 'Assignment'
  | 'IfStatement'
  | 'LoopStatement'
  | 'ReturnStatement'
  | 'MethodCall'
  | 'BinaryOp';

export interface ICodeFlowASTNode {
  id: string;
  type: ASTNodeType;
  name?: string;
  rawText: string;
  line: number;
  children: ICodeFlowASTNode[];
  semanticTags: string[]; // e.g. ['TREE_LEFT_EDGE', 'HEAP_PUSH', 'RECURSION', 'GRAPH_EDGE']
  metadata?: Record<string, any>;
}

export interface ICodeFlowAST {
  language: string;
  root: ICodeFlowASTNode;
  detectedClasses: Array<{ name: string; fields: string[] }>;
  detectedFunctions: Array<{ name: string; isRecursive: boolean; params: string[] }>;
  semanticTagsFound: Set<string>;
}

export class ASTParser {
  /**
   * Parse raw source code into normalized CodeFlow AST
   */
  static parse(code: string, language: string = 'python'): ICodeFlowAST {
    const lines = code.split('\n');
    const semanticTagsFound = new Set<string>();
    const detectedClasses: Array<{ name: string; fields: string[] }> = [];
    const detectedFunctions: Array<{ name: string; isRecursive: boolean; params: string[] }> = [];

    // Root AST node
    const rootNode: ICodeFlowASTNode = {
      id: 'root',
      type: 'Program',
      rawText: 'Program',
      line: 1,
      children: [],
      semanticTags: [],
    };

    // Analyze lines to extract AST nodes and semantic tags
    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      const trimmed = lineText.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) return;

      // Class declaration & field detection
      const classMatch = trimmed.match(/(?:class|struct)\s+([A-Za-z0-9_]+)/);
      if (classMatch) {
        const className = classMatch[1];
        const fields: string[] = [];
        if (/left/i.test(code)) fields.push('left');
        if (/right/i.test(code)) fields.push('right');
        if (/next/i.test(code)) fields.push('next');
        if (/prev/i.test(code)) fields.push('prev');
        if (/children|child/i.test(code)) fields.push('children');
        if (/parent/i.test(code)) fields.push('parent');

        detectedClasses.push({ name: className, fields });
        rootNode.children.push({
          id: `class_${className}_${lineNum}`,
          type: 'ClassDeclaration',
          name: className,
          rawText: trimmed,
          line: lineNum,
          children: [],
          semanticTags: fields.map((f) => `FIELD_${f.toUpperCase()}`),
        });
      }

      // Function detection & recursion check
      const funcMatch = trimmed.match(/(?:def|function|void|int|auto)\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)/);
      if (funcMatch) {
        const funcName = funcMatch[1];
        const params = funcMatch[2].split(',').map((p) => p.trim()).filter(Boolean);
        const isRecursive = new RegExp(`\\b${funcName}\\b`).test(code.substring(code.indexOf(trimmed) + trimmed.length));

        detectedFunctions.push({ name: funcName, isRecursive, params });
        if (isRecursive) semanticTagsFound.add('RECURSION');

        rootNode.children.push({
          id: `func_${funcName}_${lineNum}`,
          type: 'FunctionDeclaration',
          name: funcName,
          rawText: trimmed,
          line: lineNum,
          children: [],
          semanticTags: isRecursive ? ['RECURSION'] : [],
        });
      }

      // Semantic field access checks (.left, .right, ->left, ->right, .next)
      if (/\.left|->left/i.test(trimmed)) {
        semanticTagsFound.add('TREE_LEFT_EDGE');
      }
      if (/\.right|->right/i.test(trimmed)) {
        semanticTagsFound.add('TREE_RIGHT_EDGE');
      }
      if (/\.next|->next/i.test(trimmed)) {
        semanticTagsFound.add('LINKED_LIST_NEXT');
      }
      if (/heapq\.heappush|priority_queue|\.push_heap|\.heappush/i.test(trimmed)) {
        semanticTagsFound.add('PRIORITY_QUEUE_PUSH');
      }
      if (/heapq\.heappop|\.pop_heap|\.heappop/i.test(trimmed)) {
        semanticTagsFound.add('PRIORITY_QUEUE_POP');
      }
      if (/dist\[|distance\[|dist\.get/i.test(trimmed)) {
        semanticTagsFound.add('DISTANCE_TABLE');
      }
      if (/visited\.add|visited\.insert|visited\[/i.test(trimmed)) {
        semanticTagsFound.add('VISITED_SET');
      }
      if (/dp\[|memo\[/i.test(trimmed)) {
        semanticTagsFound.add('DP_TABLE');
      }
      if (/parent\[|find\(|union\(/i.test(trimmed)) {
        semanticTagsFound.add('UNION_FIND');
      }
    });

    return {
      language,
      root: rootNode,
      detectedClasses,
      detectedFunctions,
      semanticTagsFound,
    };
  }
}
