var babelCompatibility = {
  presets: ['env', 'stage-0', "react"],
  plugins: ['transform-decorators-legacy', 'transform-runtime', 'system-import-transformer']
}

var babelDev = {
  presets: ["react"],
  plugins: [
    'transform-runtime',
    'transform-decorators-legacy',
    'transform-do-expressions',
    'transform-object-rest-spread',
    'transform-class-properties',
    'transform-es2015-modules-commonjs'
  ]
}


var presets = {
  production: {
    baseUrl: '/metadatamanager/',
    apiBaseUrl: 'https://apps.crossref.org/mdt/v1',
    babelConfig: babelCompatibility
  },

  staging: {
    baseUrl: '/mmstaging/',
    apiBaseUrl: 'https://apps-staging.crossref.org/mdt',
    babelConfig: babelDev
  },
  develop: {
    baseUrl: '/mmstaging/',
    apiBaseUrl: 'http://localhost:8080/mdt-staging',
    babelConfig: babelDev
  }
}

//Set preset here:
module.exports = presets.staging
