const fs = require('fs-extra')
const path = require('path')
const child_process = require('child_process')

const plugins = process.argv[3] ? [process.argv[3]] : fs.readdirSync(__dirname).filter(e => fs.existsSync(path.join(__dirname, e, "package.json")))

if(!fs.existsSync(path.join(__dirname, "build")))
  fs.mkdirSync(path.join(__dirname, "build"))

plugins.forEach(plugin => {
  child_process.execSync(
    `npm run build:${process.argv[2] || "prod"}`,
    {
      stdio: 'inherit',
      cwd: path.join(__dirname, plugin)
    }
  );

  if(fs.existsSync(path.join(__dirname, "build", plugin)))
    fs.emptyDirSync(path.join(__dirname, "build", plugin))

  fs.cpSync(
    path.join(__dirname, plugin, "build", plugin, "."),
    path.join(__dirname, "build", plugin),
    {recursive: true}
  )
})