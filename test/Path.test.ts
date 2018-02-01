import Path from '@lib/Path';
import { } from 'jest';

describe('Path', () => {
  it('should be constructible', () => {
    const base = `/home`;
    const relative = `is/where/grey/is`;
    const directory = `${base}/${relative}`;
    const basename = 'blubber';
    const extension = '.log';
    const name = `${basename}${extension}`;
    const path = `${directory}/${name}`;
    const cls = new Path(path);
    expect(cls.path).toBe(path);
    expect(cls.name).toBe(name);
    expect(cls.extension).toBe(extension);
    expect(cls.relative(base)).toBe(`${relative}/${name}`);
  });
});
