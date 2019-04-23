var babelCompatibility = {
  presets: ['@babel/preset-env','@babel/react'],
  plugins: [['@babel/plugin-proposal-decorators',       {
    "legacy": true
  }], '@babel/plugin-transform-runtime']
}

var babelDev = {
  presets: ['@babel/preset-env','@babel/react'],
  plugins: [
    '@babel/plugin-transform-runtime',
    "@babel/plugin-syntax-dynamic-import",
    ['@babel/plugin-proposal-decorators',       {
      "legacy": true
    }],
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-syntax-object-rest-spread',
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
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
