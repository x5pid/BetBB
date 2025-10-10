
export interface NodeTree {
  id:number;
  name: string;
  type: 'node' | 'leaf';
  children?: NodeTree[];
}
