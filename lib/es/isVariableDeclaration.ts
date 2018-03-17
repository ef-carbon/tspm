import { Node, VariableDeclaration } from 'estree';

export default function isVariableDeclaration(data: Node | null | undefined): data is VariableDeclaration {
  return data !== null && data !== undefined && data.type === 'VariableDeclaration';
}
