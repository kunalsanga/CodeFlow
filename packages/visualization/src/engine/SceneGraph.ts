import { ISceneGraph, ISceneNode, ISceneEdge, ISceneLabel, ISceneHighlight, ICamera, ISceneTheme } from '../types/scene';

export const defaultDarkTheme: ISceneTheme = {
  name: 'dark',
  backgroundColor: '#0d1117',
  nodeBackground: '#ffffff',
  nodeText: '#0d1117',
  edgeColor: '#ffffff',
  activeColor: '#facc15',
  visitedColor: '#4ade80',
  comparingColor: '#f43f5e',
};

export class SceneGraph implements ISceneGraph {
  public nodes: ISceneNode[] = [];
  public edges: ISceneEdge[] = [];
  public labels: ISceneLabel[] = [];
  public highlights: ISceneHighlight[] = [];
  public camera: ICamera = { x: 0, y: 0, zoom: 1 };
  public theme: ISceneTheme = defaultDarkTheme;
  public title?: string;
  public subtitle?: string;

  constructor(initial?: Partial<ISceneGraph>) {
    if (initial) {
      if (initial.nodes) this.nodes = initial.nodes;
      if (initial.edges) this.edges = initial.edges;
      if (initial.labels) this.labels = initial.labels;
      if (initial.highlights) this.highlights = initial.highlights;
      if (initial.camera) this.camera = initial.camera;
      if (initial.theme) this.theme = initial.theme;
      if (initial.title) this.title = initial.title;
      if (initial.subtitle) this.subtitle = initial.subtitle;
    }
  }

  public addNode(node: ISceneNode): void {
    this.nodes.push(node);
  }

  public addEdge(edge: ISceneEdge): void {
    this.edges.push(edge);
  }

  public addLabel(label: ISceneLabel): void {
    this.labels.push(label);
  }

  public addHighlight(highlight: ISceneHighlight): void {
    this.highlights.push(highlight);
  }

  public clear(): void {
    this.nodes = [];
    this.edges = [];
    this.labels = [];
    this.highlights = [];
  }
}

export default SceneGraph;
