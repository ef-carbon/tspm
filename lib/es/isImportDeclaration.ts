import { ImportDeclaration, Node } from 'estree';

export default function isImportDeclaration(data: Node | null | undefined): data is ImportDeclaration {
  return data !== null && data !== undefined && data.type === 'ImportDeclaration';
}
