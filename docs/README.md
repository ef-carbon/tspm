A Node binary that can be easily added to a build process to (re-)map TypeScript module mappings to the correct relative path.

TypeScript path mappings can help reduce relative import paths in the code base. However, they are passed verbatim to the output.

`tsconfig.json`
```json
{
  "compilerOptions": {
    "module": "ES2015",
    "target": "ES2017",
    "moduleResolution": "node",
    "outDir": "dist",
    "rootDir": "./",
    "baseUrl": "./",
    "paths": {
      "@lib/*": ["lib/*"]
    }
  },
  "include": [
    "bin/**/*",
    "lib/**/*"
  ],
  "exclude": [
    "**/*.test.ts",
    "node_modules"
  ]
}
```

`lib/myFunction.ts`
```ts
export default function myFunction(lhs: number, rhs: number ): void {
  console.log(lhs + rhs);
}
```

`lib/some/nested/path/abc.ts`
```ts
import myFunction from '@lib/myFunction';  // no need for '../../../myFunction'

myFunction(1, 2);  // 3
```

Once built the output files retain the path mappings.

`dist/lib/some/nested/path/abc.js`
```js
import myFunction from '@lib/myFunction';  // not '../../../myFunction'

myFunction(1, 2);  // 3
```

Adding `ef-tspm` as a post-build step (re-)maps the paths so that they work correctly. It will automatically configure
itself from the `tsconfig.json` settings.

`package.json`
```json
{
  "scripts": {
    "postbuild": "ef-tspm"
  }
}
```

`dist/lib/some/nested/path/abc.js`
```js
import myFunction from '../../../myFunction';  // now works with normal resolutions

myFunction(1, 2);  // 3
```
