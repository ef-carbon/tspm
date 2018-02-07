import { ExportAllDeclaration, ExportNamedDeclaration } from 'estree';

import Declaration, { IOptions as IDeclarationOptions } from '@es/Declaration';

export type Interface = ExportNamedDeclaration | ExportAllDeclaration;

export type IOptions = IDeclarationOptions<Interface>;

export default class Export extends Declaration<Interface> {

  constructor(options: IOptions) {
    // RAII checks
    const { type } = options.declaration;
    if (type === 'ExportNamedDeclaration' && (options.declaration as ExportNamedDeclaration).source === null) {
      throw new TypeError(`Cannot create an ES export with a 'null' literal`);
    }

    super(options);
  }
}
