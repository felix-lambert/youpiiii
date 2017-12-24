## Synopsis

This project is the client side of the app, the CityTaps client. It is implemented at the moment in angularJS but it might change. It displays all the user, account, meter data of the citytaps api. You can also send specific messages to the meter.

## Code Example

This code example is in `app/app.js`. It gives the main routes. It's a fast way for you to understand the link between the views and the controllers.

```javascript

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
    'angularMoment'
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
    resolve : {
      'acl' : ['$q', 'AclService', function($q, AclService){
        if (AclService.can('create_meter')){
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
    resolve : {
      'acl' : ['$q', 'AclService', function($q, AclService){
        if (AclService.can('read')){
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
    resolve : {
      'acl' : ['$q', 'AclService', function($q, AclService){
        if (AclService.can('read')){
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
    resolve : {
      'acl' : ['$q', 'AclService', function($q, AclService){
        if (AclService.can('create_user')){
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
    resolve : {
      'acl' : ['$q', 'AclService', function($q, AclService){
        if (AclService.can('update_user')){
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
    resolve : {
      'acl' : ['$q', 'AclService', function($q, AclService){
        if (AclService.can('read')){
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
    resolve : {
      'acl' : ['$q', 'AclService', function($q, AclService){
        if (AclService.can('create_account')){
          // Has proper permissions
          return true;
        } else {
          console.log('Unauthorized');
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
    resolve : {
      'acl' : ['$q', 'AclService', function($q, AclService){
        if (AclService.can('read')){
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
    resolve : {
      'acl' : ['$q', 'AclService', function($q, AclService){
        if (AclService.can('read')){
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
    resolve : {
      'acl' : ['$q', 'AclService', function($q, AclService){
        if (AclService.can('see_sms')){
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
    templateUrl: 'partials/individualSms.html',
    controller: 'individualSmsCtrl',
    requireLogin: true,
    resolve : {
      'acl' : ['$q', 'AclService', function($q, AclService){
        if (AclService.can('see_sms')){
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
    resolve : {
      'acl' : ['$q', 'AclService', function($q, AclService) {
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

appConfig.$inject = ['$httpProvider', '$routeProvider', '$locationProvider','cfpLoadingBarProvider'];

function appConfig($httpProvider, $routeProvider, $locationProvider, cfpLoadingBarProvider) {
  cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
  // $locationProvider.html5Mode(true);
  // $locationProvider.hashPrefix = '!';
  $httpProvider.interceptors.push(['$rootScope', '$q', function ($rootScope, $q) {
    return {
      request: function (config) {
        config.timeout = 10000;
        return config;
      },
      responseError: function (rejection) {

        alertify.error("Connection to a $http request timed out");
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        $rootScope.authenticate = false;
        switch (rejection.status){
          case 408 :
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

appRun.$inject = ['$http', '$rootScope', '$location', 'AclService'];

function appRun($http, $rootScope, $location, AclService) {
  var aclData = {
    Reader: ['read'],
    CustomerManager: [
      'read', 
      'update_account',
      'add_credit',
      'create_account',
      'meter_details',
      'join_account',
      'update_meter',
      'update_phone_number'
    ],
    Admin: [
      'read',
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
      'reset_cycle_cumulated_consumption',
      'send_sms'
    ],
    SuperAdmin: [
      'read',
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
      'reset_cycle_cumulated_consumption',
      'send_sms'
    ]
  };
  AclService.setAbilities(aclData);
  
  $rootScope.$on('$routeChangeStart', function(event, next, current, previous, rejection) {
    // Attach the member role to the current user
    $rootScope.role = localStorage.getItem('role');
    AclService.attachRole($rootScope.role);
    for (var i in routeObject) {
      if (next.originalPath == i) {
        if (routeObject[i].requireLogin &&
          $rootScope.role)
        {
          console.log('authorized');
        } 
        else if (!routeObject[i].requireLogin && 
          $rootScope.role) {
          $location.path('/accounts');
        } else {
          $location.path('/');
        }
      }
    }
  });

  // If the route change failed due to our "Unauthorized" error, redirect them
  $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
    if (rejection === 'Unauthorized' && $rootScope.role){
      $location.path('/accounts');
    } else {
      $location.path('/');
    }
  });
}



```

## Install and start the app

### Clone the repo

```
git clone git@gitlab.com:Citytaps/ct-cloud-console.git
```

### Install brunch

```
npm install -g brunch

```

### Install grunt

```
npm install -g grunt-cli 
```

### Install live-server

```
npm install -g live-server
```

### Go to the root of the project and type:

```
npm install
grunt
``` 

### Open a new terminal go to `[root of the project]/public` and type:

```
live-server
```

### Make sure the following code is uncommented `app/assets/config`

```javascript
angular.module("citytaps").constant("apiURL", "//localhost:8080");
```

## Deploy in production

### Make sure the following code is uncommented `app/assets/config`

```javascript
angular.module("citytaps").constant("apiURL", "https://api.citytaps.org");
```

### Run at the root of the project:

```
grunt build
```

### If you want to test the code minified but not prepare the code for production, please type:

```
brunch build --production
```

### Push your code

## Tests

The client is not tested yet
# youpiiii
