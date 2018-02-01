// tslint:disable-next-line:no-implicit-dependencies
import { ExportAllDeclaration, ExportNamedDeclaration } from 'estree';

import Declaration, { IOptions as IDeclarationOptions } from '@lib/Declaration';

export type IOptions = IDeclarationOptions<ExportNamedDeclaration | ExportAllDeclaration>;

export default class Export extends Declaration<ExportNamedDeclaration | ExportAllDeclaration> {

  constructor(options: IOptions) {
    // RAII checks
    const { type } = options.declaration;
    if (type === 'ExportNamedDeclaration' && (options.declaration as ExportNamedDeclaration).source === null) {
      throw new TypeError(`Cannot create an export with a 'null' literal`);
    }

    super(options);
  }
}
