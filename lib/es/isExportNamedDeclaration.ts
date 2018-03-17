import { ExportNamedDeclaration, Node } from 'estree';

export default function isExportNamedDeclaration(data: Node | null | undefined): data is ExportNamedDeclaration {
  return data !== null &&
    data !== undefined &&
    (data.type === 'ExportAllDeclaration'
      || (data.type === 'ExportNamedDeclaration' && data.source !== null));
}
