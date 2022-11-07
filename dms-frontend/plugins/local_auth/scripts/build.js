process.env.BABEL_ENV = process.argv[2] || "production";
process.env.NODE_ENV = process.argv[2] || "production";

process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const webpack = require('webpack');
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;
const isInteractive = process.stdout.isTTY;
const config = configFactory( process.argv[2] || "production");
const { checkBrowsers } = require('react-dev-utils/browsersHelper');


(async function(){
  await checkBrowsers(paths.appPath, isInteractive)
  const sizes = await measureFileSizesBeforeBuild(paths.appBuild)
  fs.emptyDirSync(paths.appBuild);
  const compiler = webpack(config);
  const stats = await new Promise((res, rej) => {
    compiler.run((err, stats) => {
      if(err) rej(err)
      res(stats)
    })
  })

  const s = stats.toJson({ all: false, warnings: true, errors: true })

  console.log(s.warnings.join('\n\n'))
  console.log(s.errors.join('\n\n'))

  printFileSizesAfterBuild(
    stats,
    sizes,
    paths.appBuild,
    WARN_AFTER_BUNDLE_GZIP_SIZE,
    WARN_AFTER_CHUNK_GZIP_SIZE
  );



})()
