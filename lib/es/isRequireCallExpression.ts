import isIdentifier from '@es/isIdentifier';
import isSimpleCallExpression from '@es/isSimpleCallExpression';
import isSimpleLiteral from '@es/isSimpleLiteral';
import RequireCallExpression from '@es/RequireCallExpression';
import { Node } from 'estree';

export default function isRequireCallExpression(data: Node | undefined | null): data is RequireCallExpression {
  return data !== null &&
    data !== undefined &&
    isSimpleCallExpression(data) &&
    isIdentifier(data.callee) &&
    data.callee.name === 'require' &&
    data.arguments.length === 1 &&
    isSimpleLiteral(data.arguments[0]);
}
