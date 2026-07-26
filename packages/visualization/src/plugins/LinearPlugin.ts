import { SceneGraph } from '../engine/SceneGraph';
import { LinearLayout } from '../layouts/LinearLayout';
import { ISemanticIR } from '@codeflow/types';

export class LinearPlugin {
  public static buildScene(semanticIR: ISemanticIR): SceneGraph {
    const currentStep = semanticIR.metadata.currentStep || 0;
    const scene = new SceneGraph({
      title: 'Singly Linked List',
      subtitle: `Step ${currentStep + 1} of ${semanticIR.metadata.totalSteps}`,
    });

    const mockNodes = [
      { id: '1', label: '10', subLabel: 'HEAD' },
      { id: '2', label: '20' },
      { id: '3', label: '30' },
      { id: '4', label: '40', subLabel: 'TAIL' },
    ];

    const calculatedNodes = LinearLayout.calculatePositions(mockNodes, {
      spacing: 140,
      startPos: { x: 80, y: 150 },
    });

    calculatedNodes.forEach(n => scene.addNode(n));

    for (let i = 0; i < calculatedNodes.length - 1; i++) {
      scene.addEdge({
        id: `e-${calculatedNodes[i].id}-${calculatedNodes[i + 1].id}`,
        sourceId: calculatedNodes[i].id,
        targetId: calculatedNodes[i + 1].id,
        type: 'arrow',
      });
    }

    return scene;
  }
}

export default LinearPlugin;
