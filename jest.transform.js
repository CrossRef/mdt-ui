
module.exports = require('babel-jest').createTransformer({
  presets: ['env', 'stage-0', "react"],
  plugins: ['transform-decorators-legacy', 'transform-runtime', 'system-import-transformer'],
  retainLines: true
});