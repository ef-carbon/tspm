import { Node, SimpleLiteral } from 'estree';

export default function isIdentifier(data: Node | null | undefined): data is SimpleLiteral {
  return data !== null && data !== undefined && data.type === 'Literal';
}
