
module.exports = require('babel-jest').createTransformer({
  presets: ['@babel/env','@babel/react'],
  plugins: [[require('@babel/plugin-proposal-decorators'), { legacy: true }], 
  '@babel/plugin-transform-runtime', 
  '@babel/plugin-proposal-do-expressions',
  '@babel/plugin-syntax-object-rest-spread',
  ["@babel/plugin-proposal-class-properties", { "loose" : true }]],
  retainLines: true
});