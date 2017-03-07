var citytapsApp = angular.module('citytaps',
  [
    'ngRoute',
    'xeditable',
    'ngMessages',
    'angular-loading-bar',
    'ui.select',
    'ngSanitize',
    'mm.acl',
    'ui.bootstrap',
    "ui.bootstrap.tpls",
    'angularMoment',
    'ngMap',
    'pascalprecht.translate',
    'angular-google-analytics'
  ]).config(appConfig).run(appRun);

function config() {
  return {headers: {'Authorization': localStorage.getItem('token')}};
}

var routeObject = {
  '/': {
    templateUrl: 'partials/login.html',
    controller: 'loginCtrl',
    requireLogin: false
  },
  '/meters/new': {
    templateUrl: 'partials/newMeter.html',
    controller: 'newMeterCtrl',
    requireLogin: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('create_meter')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  },
  '/dashboards': {
    templateUrl: 'partials/dashboard.html',
    controller: 'dashboardCtrl',
    requireLogin: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('read')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  },
  '/meters/:serial': {
    templateUrl: 'partials/individualMeter.html',
    controller: 'individualMeterCtrl',
    requireLogin: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('read')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  },
  '/meters': {
    templateUrl: 'partials/meters.html',
    controller: 'meterCtrl',
    requireLogin: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('read')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  },
  '/users/new': {
    templateUrl: 'partials/newUser.html',
    controller: 'newUserCtrl',
    requireLogin: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('create_user')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  },
  '/users/:id': {
    templateUrl: 'partials/individualUser.html',
    controller: 'individualUserCtrl',
    requireLogin: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('update_user')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  },
  '/users': {
    templateUrl: 'partials/users.html',
    controller: 'userCtrl',
    requireLogin: true,
    requireReader: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('read')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  },
  '/accounts/events': {
    templateUrl: 'partials/account-events.html',
    controller: 'accountEventsCtrl',
    requireLogin: true,
    requireReader: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('read')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  },
  '/accounts/new': {
    templateUrl: 'partials/newAccount.html',
    controller: 'newAccountCtrl',
    requireLogin: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('create_account')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  },
  '/accounts/:id': {
    templateUrl: 'partials/individualAccount.html',
    controller: 'individualAccountCtrl',
    requireLogin: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('read')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  },
  '/accounts': {
    templateUrl: 'partials/accounts.html',
    controller: 'accountCtrl',
    requireLogin: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('read')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  },
  '/sms': {
    templateUrl: 'partials/sms.html',
    controller: 'smsCtrl',
    requireLogin: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('see_sms')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  },
  '/sms/:account_id': {
    templateUrl: 'partials/sms.html',
    controller: 'individualSmsCtrl',
    requireLogin: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('see_sms')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  },
  '/transactions/:id': {
    templateUrl: 'partials/transactionHistory.html',
    controller: 'transactionHistoryCtrl',
    requireLogin: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('read')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  },
  '/maps': {
    templateUrl: 'partials/maps.html',
    controller: 'mapCtrl',
    requireLogin: true,
    resolve: {
      'acl': ['$q', 'AclService', function($q, AclService) {
        if (AclService.can('read')) {
          // Has proper permissions
          return true;
        } else {
          // Does not have permission
          return $q.reject('Unauthorized');
        }
      }]
    }
  }
};

appConfig.$inject = ['$httpProvider', '$routeProvider', '$locationProvider', '$translateProvider', 'cfpLoadingBarProvider', 'AnalyticsProvider', 'googleAnalyticsId'];

function appConfig($httpProvider, $routeProvider, $locationProvider, $translateProvider, cfpLoadingBarProvider, AnalyticsProvider, googleAnalyticsId) {

  cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
  AnalyticsProvider.setAccount(googleAnalyticsId);  //UU-XXXXXXX-X should be your tracking code

  $translateProvider.useStaticFilesLoader({
    prefix: 'languages/',
    suffix: '.json'
  });

  $translateProvider.preferredLanguage('en');
  $translateProvider.useSanitizeValueStrategy('escape');
  // $locationProvider.html5Mode(true);
  // $locationProvider.hashPrefix = '!';
  $httpProvider.interceptors.push(['$rootScope', '$q', function($rootScope, $q) {
    return {
      request: function(config) {
        config.timeout = 20000;
        return config;
      },
      responseError: function(rejection) {

        function goBackToLogin() {
          alertify.error("You need to reconnect");
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          $rootScope.authenticate = false;
          $location.path('/login');
        }

        switch (rejection.status) {
          case 408 :
            break;
          case 500 :
            break;
          case 404:
            break;
          case 403:
            break;
          case 401:
            goBackToLogin();
            break;
        }
        return $q.reject(rejection);
      }
    }
  }]);
  for (var path in routeObject) {
    $routeProvider.when(path, routeObject[path]);
  }
  $routeProvider.otherwise({
    redirectTo: '/'
  });
}

appRun.$inject = ['$http', '$rootScope', '$location', 'AclService', '$translate', 'Analytics'];

function appRun($http, $rootScope, $location, AclService, $translate, Analytics) {
  var aclData = {
    Reader: [
      'accountDetails',
      'read',
      'accountPage',
      'mapPage'
    ],
    CustomerManager: [
      'change_customer_view',
      'add_account',
      'read',
      'button_actions',
      'update_account',
      'add_credit',
      'create_account',
      'meter_details',
      'join_account',
      'update_meter',
      'update_phone_number',
      'accountDetails',
      'seeAccountNull',
      'accountPage',
      'meterPage',
      'userPage',
      'mapPage',
      'smsPage',
      'seeMoreDetailsInAccountPage',
      'account_events_details'
    ],
    Admin: [
      'change_customer_view',
      'add_account',
      'read',
      'button_actions',
      'meter_details',
      'join_account',
      'update_account',
      'add_credit',
      'create_account',
      'send_message',
      'delete_account',
      'see_sms',
      'create_meter',
      'update_meter',
      'update_user',
      'enable_payment',
      'update_phone_number',
      'reset_cycles',
      'send_sms',
      'updateRole',
      'accountDetails',
      'seeAccountNull',
      'accountPage',
      'meterPage',
      'userPage',
      'mapPage',
      'smsPage',
      'seeMoreDetailsInAccountPage',
      'account_events_details'
    ],
    SuperAdmin: [
      'change_customer_view',
      'add_account',
      'read',
      'button_actions',
      'meter_details',
      'join_account',
      'update_meter',
      'add_credit',
      'update_account',
      'create_account',
      'send_message',
      'delete_account',
      'see_sms',
      'create_meter',
      'create_user',
      'update_user',
      'enable_payment',
      'update_phone_number',
      'reset_cycles',
      'send_sms',
      'updateRole',
      'accountDetails',
      'seeAccountNull',
      'accountPage',
      'meterPage',
      'userPage',
      'mapPage',
      'smsPage',
      'seeMoreDetailsInAccountPage',
      'account_events_details'
    ]
  };
  AclService.setAbilities(aclData);


  $rootScope.$on('$routeChangeStart', function(event, next, current, previous, rejection) {
    $rootScope.language = localStorage.getItem('language');

    if ($rootScope.language == 'fr') {
      $translate.use('fr');
    } else {
      $translate.use('en');
    }
    // Attach the member role to the current user
    $rootScope.role = localStorage.getItem('role');
    AclService.attachRole($rootScope.role);
    for (var i in routeObject) {
      if (next.originalPath == i) {
        if (routeObject[i].requireLogin &&
          $rootScope.role) {
        }
        else if (!routeObject[i].requireLogin &&
          $rootScope.role) {
          $location.path('/dashboards');
        } else {
          $location.path('/');
        }
      }
    }
  });

  // If the route change failed due to our "Unauthorized" error, redirect them
  $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
    if (rejection === 'Unauthorized' && $rootScope.role) {
      $location.path('/dashboards');
    } else {
      $location.path('/');
    }
  });
}
