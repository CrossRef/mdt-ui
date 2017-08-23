// See http://brunch.io for documentation.
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
  babel: {presets: ['latest', 'react', 'stage-0'], plugins: ['transform-runtime', 'transform-decorators-legacy']}
}

exports.server = {
  hostname: '0.0.0.0',
  base: '/metadatamanager/'
}

