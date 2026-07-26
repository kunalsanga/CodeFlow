import { IAlgorithmDetectionResult } from '@/types/semantic/ir';
import { ASTParser, ICodeFlowAST } from '../parser/ast_parser';

// Multi-Stage Semantic DSA Detection Engine for CodeFlow
// Evaluates AST Analysis, Runtime Trace Dynamics, Data Structure Graph Topology,
// Algorithmic Behavior Idioms, and Weighted Confidence Scoring (0 - 100%).

interface IDSAEvaluator {
  name: string;
  suggestedRenderer: string;
  evaluate(ast: ICodeFlowAST, code: string, traceEvents?: any[]): { confidence: number; evidence: string[]; stageScores: { astScore: number; traceScore: number; graphScore: number; behaviorScore: number } };
}

export class AlgorithmDetector {
  private static evaluators: IDSAEvaluator[] = [
    // Linked List Evaluator (Singly / Doubly Linked List) - High Priority
    {
      name: 'linked-list',
      suggestedRenderer: 'linked-list-renderer',
      evaluate(ast, code) {
        let astScore = 0;
        let traceScore = 0;
        let graphScore = 0;
        let behaviorScore = 0;
        const evidence: string[] = [];

        if (/struct\s+Node|class\s+Node|Node\*|next\b|prev\b|head\b|tail\b|LinkedList/i.test(code)) {
          astScore += 45;
          evidence.push('AST: Node class/struct with next/prev pointers & LinkedList structure');
        }

        if (/insert|insertFront|deleteNode|delete|reverse|display|search/i.test(code) && /head|next|Node/i.test(code)) {
          behaviorScore += 45;
          evidence.push('Behavior: Linked list insertion, deletion, reversal, and pointer traversal');
        }

        if (/LinkedList\s+\w+|head\s*=\s*new\s+Node|curr->next|temp->next/i.test(code)) {
          graphScore += 10;
          evidence.push('Graph Topology: Sequential pointer chaining');
        }

        const confidence = (astScore + traceScore + graphScore + behaviorScore) / 100;
        return { confidence, evidence, stageScores: { astScore, traceScore, graphScore, behaviorScore } };
      },
    },

    // Recursion Call Stack Evaluator
    {
      name: 'recursion',
      suggestedRenderer: 'recursion-renderer',
      evaluate(ast, code) {
        let astScore = 0;
        let traceScore = 0;
        let graphScore = 0;
        let behaviorScore = 0;
        const evidence: string[] = [];

        const isRecursiveFunc = ast.semanticTagsFound.has('RECURSION') || /def\s+(\w+)[\s\S]*?\b\1\s*\(/i.test(code) || /function\s+(\w+)[\s\S]*?\b\1\s*\(/i.test(code);
        if (isRecursiveFunc) {
          astScore += 50;
          evidence.push('AST: Self-referential recursive function call');
        }

        if (/if\s+.*<=?\s*\d+:?\s*return|if\s*\(.*<=?\s*\d+\)\s*return/i.test(code) || /return\s+\w+\s*\(.*?\)\s*[\+\-\*\/]/i.test(code)) {
          behaviorScore += 45;
          evidence.push('Behavior: Base case return condition and recursive stack unwind');
        }

        if (isRecursiveFunc && !/dp\[|memo\[|@lru_cache/i.test(code)) {
          astScore += 5;
        }

        const confidence = (astScore + traceScore + graphScore + behaviorScore) / 100;
        return { confidence, evidence, stageScores: { astScore, traceScore, graphScore, behaviorScore } };
      },
    },

    // BFS (Breadth-First Search) Evaluator
    {
      name: 'bfs',
      suggestedRenderer: 'bfs-renderer',
      evaluate(ast, code) {
        let astScore = 0;
        let traceScore = 0;
        let graphScore = 0;
        let behaviorScore = 0;
        const evidence: string[] = [];

        if (/deque|queue|popleft|shift\(/i.test(code)) {
          astScore += 35;
          evidence.push('AST: Queue data structure operations (deque / popleft)');
        }
        if (/visited\.add|visited\.insert|visited\[|visited_set/i.test(code)) {
          graphScore += 30;
          evidence.push('Graph Topology: Visited set tracking');
        }
        if (/while\s+q|while\s+queue|for.*graph\[/i.test(code)) {
          behaviorScore += 35;
          evidence.push('Behavior: BFS level-order queue loop traversal');
        }

        const confidence = (astScore + traceScore + graphScore + behaviorScore) / 100;
        return { confidence, evidence, stageScores: { astScore, traceScore, graphScore, behaviorScore } };
      },
    },

    // DFS (Depth-First Search) Evaluator
    {
      name: 'dfs',
      suggestedRenderer: 'dfs-renderer',
      evaluate(ast, code) {
        let astScore = 0;
        let traceScore = 0;
        let graphScore = 0;
        let behaviorScore = 0;
        const evidence: string[] = [];

        if (/def\s+dfs|function\s+dfs|void\s+dfs/i.test(code)) {
          astScore += 35;
          evidence.push('AST: Recursive function definition for DFS');
        }
        if (/visited\.add|visited\.insert|visited\[/i.test(code)) {
          graphScore += 30;
          evidence.push('Graph Topology: Visited set tracking');
        }
        if (/dfs\(.*nxt\)|dfs\(.*neighbor\)|dfs\(.*v\)/i.test(code) || (/dfs\(/i.test(code) && /graph\[/i.test(code))) {
          behaviorScore += 35;
          evidence.push('Behavior: Recursive graph traversal and backtracking');
        }

        const confidence = (astScore + traceScore + graphScore + behaviorScore) / 100;
        return { confidence, evidence, stageScores: { astScore, traceScore, graphScore, behaviorScore } };
      },
    },

    // Dijkstra Algorithm Evaluator
    {
      name: 'dijkstra',
      suggestedRenderer: 'dijkstra-renderer',
      evaluate(ast, code) {
        let astScore = 0;
        let traceScore = 0;
        let graphScore = 0;
        let behaviorScore = 0;
        const evidence: string[] = [];

        if (ast.semanticTagsFound.has('PRIORITY_QUEUE_PUSH') || ast.semanticTagsFound.has('PRIORITY_QUEUE_POP') || /heappush|heappop|priority_queue/i.test(code)) {
          astScore += 30;
          evidence.push('AST: Priority queue operations detected');
        }
        if (ast.semanticTagsFound.has('DISTANCE_TABLE') || /dist\[|distance\[/i.test(code)) {
          astScore += 20;
          evidence.push('AST: Distance table detected');
        }
        if (/graph\[|adj\[|neighbors|edges/i.test(code)) {
          graphScore += 25;
          evidence.push('Graph Topology: Adjacency list representation');
        }
        if (/dist\[.*\]\s*>\s*dist\[.*\]\s*\+/i.test(code) || /float\('inf'\)|Infinity/i.test(code)) {
          behaviorScore += 25;
          evidence.push('Behavior: Edge relaxation pattern (dist[v] > dist[u] + w)');
        }

        const confidence = (astScore + traceScore + graphScore + behaviorScore) / 100;
        return { confidence, evidence, stageScores: { astScore, traceScore, graphScore, behaviorScore } };
      },
    },

    // Merge Sort Evaluator
    {
      name: 'merge-sort',
      suggestedRenderer: 'merge-sort-renderer',
      evaluate(ast, code) {
        let astScore = 0;
        let traceScore = 0;
        let graphScore = 0;
        let behaviorScore = 0;
        const evidence: string[] = [];

        if (/merge_sort|mergeSort/i.test(code)) {
          astScore += 30;
          evidence.push('AST: Recursive divide-and-conquer function');
        }
        if (/mid\s*=\s*|len\(.*\)\s*\/\/\s*2|Math\.floor/i.test(code)) {
          behaviorScore += 30;
          evidence.push('Behavior: Array middle split calculation');
        }
        if (/merge\(|left.*right|left_half.*right_half/i.test(code)) {
          behaviorScore += 40;
          evidence.push('Behavior: Sub-array merge step');
        }

        const confidence = (astScore + traceScore + graphScore + behaviorScore) / 100;
        return { confidence, evidence, stageScores: { astScore, traceScore, graphScore, behaviorScore } };
      },
    },

    // Quick Sort Evaluator
    {
      name: 'quick-sort',
      suggestedRenderer: 'quick-sort-renderer',
      evaluate(ast, code) {
        let astScore = 0;
        let traceScore = 0;
        let graphScore = 0;
        let behaviorScore = 0;
        const evidence: string[] = [];

        if (/quick_sort|quickSort/i.test(code)) {
          astScore += 30;
          evidence.push('AST: Recursive partition calls');
        }
        if (/pivot/i.test(code)) {
          behaviorScore += 35;
          evidence.push('Behavior: Pivot element selection');
        }
        if (/partition/i.test(code) || (/\bswap\b|\[i\],\s*\[j\]\s*=\s*\[j\],\s*\[i\]/i.test(code) && /pivot/i.test(code))) {
          behaviorScore += 35;
          evidence.push('Behavior: Element partitioning around pivot');
        }

        const confidence = (astScore + traceScore + graphScore + behaviorScore) / 100;
        return { confidence, evidence, stageScores: { astScore, traceScore, graphScore, behaviorScore } };
      },
    },

    // Trie Evaluator
    {
      name: 'trie',
      suggestedRenderer: 'trie-renderer',
      evaluate(ast, code) {
        let astScore = 0;
        let traceScore = 0;
        let graphScore = 0;
        let behaviorScore = 0;
        const evidence: string[] = [];

        if (/children|child|is_end_of_word|isEnd/i.test(code)) {
          astScore += 40;
          evidence.push('AST: Trie node children mapping and end-of-word flags');
        }
        if (/insert\(.*word\)|search\(.*word\)|startsWith/i.test(code)) {
          behaviorScore += 60;
          evidence.push('Behavior: Trie character prefix traversal');
        }

        const confidence = (astScore + traceScore + graphScore + behaviorScore) / 100;
        return { confidence, evidence, stageScores: { astScore, traceScore, graphScore, behaviorScore } };
      },
    },

    // Dynamic Programming Evaluator (Requires explicit DP table/vector/memo storage)
    {
      name: 'dynamic-programming',
      suggestedRenderer: 'dp-renderer',
      evaluate(ast, code) {
        let astScore = 0;
        let traceScore = 0;
        let graphScore = 0;
        let behaviorScore = 0;
        const evidence: string[] = [];

        // Strict Guard: If code does NOT have dp[] or memo[] or vector<vector<int>> dp, DP score is 0
        const hasDPStorage = /vector\s*<\s*vector\s*<\s*int\s*>\s*>\s*dp|vector\s*<\s*int\s*>\s*dp|\bdp\s*\[|\bmemo\s*\[|@lru_cache/i.test(code);
        if (!hasDPStorage) {
          return { confidence: 0, evidence: [], stageScores: { astScore: 0, traceScore: 0, graphScore: 0, behaviorScore: 0 } };
        }

        if (ast.semanticTagsFound.has('DP_TABLE') || hasDPStorage) {
          astScore += 40;
          evidence.push('AST: 1D/2D DP table memoization storage');
        }

        if (/dp\[i\]\[j\]|dp\[i\]|memo\[.*\]|knapsack|lcs|lis/i.test(code)) {
          behaviorScore += 60;
          evidence.push('Behavior: DP recurrence relation state transition with table storage');
        }

        const confidence = (astScore + traceScore + graphScore + behaviorScore) / 100;
        return { confidence, evidence, stageScores: { astScore, traceScore, graphScore, behaviorScore } };
      },
    },

    // Binary Search Tree Evaluator
    {
      name: 'binary-search-tree',
      suggestedRenderer: 'bst-renderer',
      evaluate(ast, code) {
        let astScore = 0;
        let traceScore = 0;
        let graphScore = 0;
        let behaviorScore = 0;
        const evidence: string[] = [];

        const treeClass = ast.detectedClasses.find(c => c.fields.includes('left') && c.fields.includes('right'));
        if (treeClass) {
          astScore += 40;
          evidence.push(`AST: Class '${treeClass.name}' has left and right child fields`);
        }

        if (/root|insert|inorder|preorder|postorder|rotate_right|rotate_left/i.test(code)) {
          behaviorScore += 45;
          evidence.push('Behavior: Tree insertion / traversal / rotation operations');
        }

        if (treeClass && !/Node|BST|Tree/i.test(treeClass.name) && !/root|insert|tree/i.test(code)) {
          astScore = 10;
          behaviorScore = 0;
          evidence.push('Guard: Non-tree domain class detected without tree behavior');
        }

        const confidence = (astScore + traceScore + graphScore + behaviorScore) / 100;
        return { confidence, evidence, stageScores: { astScore, traceScore, graphScore, behaviorScore } };
      },
    },
  ];

  static detect(code: string, language: string = 'python'): IAlgorithmDetectionResult {
    const ast = ASTParser.parse(code, language);

    let bestResult: IAlgorithmDetectionResult = {
      algorithmType: 'generic-memory',
      confidence: 0.1,
      detectedFrom: ['Generic stack and heap execution trace'],
      suggestedRenderer: 'generic-renderer',
      stageScores: { astScore: 10, traceScore: 0, graphScore: 0, behaviorScore: 0 },
    };

    for (const evaluator of this.evaluators) {
      const { confidence, evidence, stageScores } = evaluator.evaluate(ast, code);

      if (confidence > bestResult.confidence && confidence >= 0.4) {
        bestResult = {
          algorithmType: evaluator.name,
          confidence: Math.min(confidence, 1.0),
          detectedFrom: evidence,
          suggestedRenderer: evaluator.suggestedRenderer,
          stageScores,
        };
      }
    }

    return bestResult;
  }

  static getSupportedAlgorithms(): string[] {
    return this.evaluators.map(e => e.name);
  }
}

export default AlgorithmDetector;