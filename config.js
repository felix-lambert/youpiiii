exports.config = {
  "modules": {
    "definition": false,
    "wrapper": false
  },
  "files": {
    "javascripts": {
      "defaultExtension": 'js',
      "joinTo": {
        'scripts/app.js': /^app/,
        'scripts/vendor.js': /^vendor/
      },
      "order": {
        "before": [
          'vendor/scripts/jquery.min.js',
          'vendor/scripts/bootstrap.min.js',
          'vendor/scripts/angular.js',
          'vendor/scripts/angular-resource.js',
          'vendor/scripts/angular-route.js',
          'vendor/scripts/angular-translate.min.js',
          'vendor/scripts/angular-translate-loader-static-files.min.js',
          'vendor/scripts/ng-map.min.js',
          'vendor/scripts/angular-google-analytics.min.js',
          'vendor/scripts/ui-bootstrap.js',
          'vendor/scripts/alertify.min.js',
          'vendor/scripts/angular-messages.min.js',
          'vendor/scripts/ui-bootstrap-tpls.js',
          'vendor/scripts/moment.js',
          'vendor/scripts/angular-moment.js',
          'vendor/scripts/sweetalert2.min.js'
        ]
      }
    },
    "templates": {
      "defaultExtension": 'html',
      "joinTo": 'scripts/app.js'
    },
    "stylesheets": {
      "joinTo": {'css/app.css': /^app/}
    }
  },
  "npm": {
    "enabled": false,
  },
  "paths": {
    "/": "."
  },
  conventions: {
    ignored: [
      '/^app/scss/bootstrap/bootstrap-sass'
    ]
  },
  "plugins": {
    "sass": {
      "options": {
        "includePaths": ['/*.scss']
      }
    }
  }
};
