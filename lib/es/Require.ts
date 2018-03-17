import RequireCallExpression from '@es/RequireCallExpression';

import Declaration, { IOptions as IDeclarationOptions } from '@es/Declaration';

export type Interface = RequireCallExpression;

export type IOptions = IDeclarationOptions<Interface>;

export default class Require extends Declaration<Interface> {}
