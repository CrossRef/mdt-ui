
var presets = {
  production: {
    baseUrl: '/metadatamanager/',
    apiBaseUrl: 'https://apps.crossref.org/mdt/v1/'
  },

  staging: {
    baseUrl: '/mmstaging/',
    apiBaseUrl: 'https://apps.crossref.org/mdt-staging/'
  }
}

module.exports = presets.production