// tslint:disable-next-line:no-implicit-dependencies
import { ImportDeclaration } from 'estree';

import Declaration, { IOptions as IDeclarationOptions } from '@lib/Declaration';

export type IOptions = IDeclarationOptions<ImportDeclaration>;

export default class Export extends Declaration<ImportDeclaration> {}
