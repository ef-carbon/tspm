import { Identifier, Node } from 'estree';

export default function isIdentifier(data: Node | null | undefined): data is Identifier {
  return data !== null && data !== undefined && data.type === 'Identifier';
}
