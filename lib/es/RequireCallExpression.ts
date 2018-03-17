import { Identifier, SimpleCallExpression, SimpleLiteral } from 'estree';

// tslint:disable-next-line:interface-name
export default interface RequireCallExpression extends SimpleCallExpression {
  callee: Identifier;
  arguments: [ SimpleLiteral ];
}
