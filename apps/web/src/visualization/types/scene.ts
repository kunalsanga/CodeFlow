export type NodePrimitiveType = 'circle' | 'rectangle' | 'diamond' | 'memory-cell';
export type EdgePrimitiveType = 'straight' | 'arrow' | 'bezier' | 'curved';

export interface IPoint {
  x: number;
  y: number;
}

export interface ISceneNode {
  id: string;
  type: NodePrimitiveType;
  position: IPoint;
  size?: { width: number; height: number };
  label: string;
  subLabel?: string;
  value?: any;
  state?: 'default' | 'active' | 'visited' | 'comparing' | 'swapping' | 'deleted' | 'highlighted';
  style?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
  };
  metadata?: Record<string, any>;
}

export interface ISceneEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: EdgePrimitiveType;
  label?: string;
  dashed?: boolean;
  state?: 'default' | 'active' | 'visited' | 'highlighted';
  style?: {
    strokeColor?: string;
    strokeWidth?: number;
  };
}

export interface ISceneLabel {
  id: string;
  text: string;
  position: IPoint;
  fontSize?: number;
  color?: string;
}

export interface ISceneHighlight {
  id: string;
  targetId: string;
  type: 'ring' | 'glow' | 'box' | 'pointer';
  color?: string;
  label?: string;
}

export interface ICamera {
  x: number;
  y: number;
  zoom: number;
}

export interface ISceneTheme {
  name: string;
  backgroundColor: string;
  nodeBackground: string;
  nodeText: string;
  edgeColor: string;
  activeColor: string;
  visitedColor: string;
  comparingColor: string;
}

export interface ISceneGraph {
  nodes: ISceneNode[];
  edges: ISceneEdge[];
  labels: ISceneLabel[];
  highlights: ISceneHighlight[];
  camera: ICamera;
  theme: ISceneTheme;
  title?: string;
  subtitle?: string;
}
