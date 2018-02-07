import { ImportDeclaration } from 'typescript';

import Declaration, { IOptions as IDeclarationOptions } from '@ts/Declaration';

export type Interface = ImportDeclaration;

export type IOptions = IDeclarationOptions<Interface>;

export default class Import extends Declaration<Interface> {}
