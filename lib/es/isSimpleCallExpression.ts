import { Node, SimpleCallExpression } from 'estree';

export default function isSimpleCallExpression(data: Node | undefined | null): data is SimpleCallExpression {
  return data !== null && data !== undefined && data.type === 'CallExpression';
}
