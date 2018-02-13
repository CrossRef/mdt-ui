// See http://brunch.io for documentation.
var config = require('./deployConfig')

exports.sourceMaps = true

exports.files = {
  javascripts: {
    joinTo: {
      'assets/js/app.js': /^app/,
      'assets/js/libs.js': /^(?!app)/
    }
  },
  stylesheets: {joinTo: 'assets/app.css'},
  templates: {
    joinTo: 'assets/js/app.js'
  },
  conventions: {
    vendor: /^vendor[\\/]/
  },

  modules: {
    nameCleaner: function (path) {
      return path.replace(/^(app|bower_components\/.*(\/dist)?)\//, '')
    }
  }
}

exports.paths = {
  public: 'metadatamanager'
}

exports.watcher = {
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  }
}

exports.plugins = {
  sass: {
    mode: 'native'
  },
  babel: config.babelConfig,
  autoReload: {enabled: true}
}

exports.server = {
  hostname: '0.0.0.0',
  base: config.baseUrl
}

