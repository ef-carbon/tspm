import Export from '@lib/Export';
import Import from '@lib/Import';
import Mapper, { IOptions as IMapperOptions } from '@lib/Mapper';

export type IOptions = IMapperOptions;

export default async function *convert({ ...other}: IOptions): AsyncIterableIterator<Import | Export> {
  const mapper = new Mapper({ ...other });
  yield* mapper.map();
}
