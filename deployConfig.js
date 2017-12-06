
var presets = {
  production: {
    baseUrl: '/metadatamanager/',
    apiBaseUrl: 'https://apps.crossref.org/mdt/v1'
  },

  staging: {
    baseUrl: '/mmstaging/',
    apiBaseUrl: 'http://localhost:8080/mdt-staging'
  }
}

module.exports = presets.staging
