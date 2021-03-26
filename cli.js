#! /usr/bin/env node
import fs from 'fs/promises';
import displayHelpOutput from './lib/commands/help.js';
import initializeProject from './lib/commands/init.js';
import generateTestFiles from './lib/commands/generate.js';
import run from './lib/commands/run.js';
import parseCliFlags from './lib/utils/parse-cli-flags.js';
import resolvePortNumberFor from './lib/utils/resolve-port-number-for.js';

process.title = 'qunitx';

(async () => {
  if (!process.argv[2]) {
    return await displayHelpOutput();
  } else if (['help', 'h', 'p', 'print'].includes(process.argv[2])) {
    return await displayHelpOutput();
  } else if (['new', 'n', 'g', 'generate'].includes(process.argv[2])) {
    return await generateTestFiles();
  } else if (['init'].includes(process.argv[2])) {
    return await initializeProject();
  }

  let config = await parseCliFlags();

  Object.assign(config, {
    httpPort: config.httpPort || 1234,
    timeout: config.timeout || 10000,
    output: config.output|| `${config.projectRoot}/tmp`,
    htmlPaths: config.htmls || [`${config.projectRoot}/test/tests.html`] // TODO: add this to package.json
  });

  return await run(config);
})();
