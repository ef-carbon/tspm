// tslint:disable-next-line:no-import-side-effect no-submodule-imports
import 'core-js/modules/es7.symbol.async-iterator';

import main from '@lib/main';

process.title = 'ef-tspm';

main(process.argv)
  .then(status => process.exit(status))
  .catch(({ message }) => {
    process.stderr.write(`Fatal Error: ${message}\n`);
    process.exit(69);
  });
