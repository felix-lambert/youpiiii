angular.module('citytaps').controller('navigationBarCtrl', navigationBarCtrl);

navigationBarCtrl.$inject = ['$rootScope', 'AclService', '$q', '$scope', 'meter', 'user', '$location', 'apiURL', '$rootScope', 'account', 'meterMessage', '$routeParams', '$translate'];
function navigationBarCtrl($rootScope, AclService, $q, $scope, meter, user, $location, apiURL, $rootScope, account, meterMessage, $routeParams, $translate) {

  $scope.refreshButton       = refreshButton;
  $scope.select              = select;
  $scope.isActive            = isActive;
  $scope.disconnect          = disconnect;
  $scope.can                 = AclService.can;

  displayNavbar($rootScope.language);

  function config() {
    return {headers: {'Authorization': localStorage.getItem('token')}}
  }

  function displayErrorMessage(error, status) {
    $scope.errorMessage = 'An error occured: please reload the page!';
    if (error.message = "invalidToken") {
      $location.path('/login');
    }
  }

  function meterMessageUpdate(mmu) {


  }

  function individualMeterMessageUpdate(individualMeterUpdated) {
    $rootScope.$broadcast('update-individual-meter', individualMeterUpdated);
  }

  function endLoading() {
  }

  function smsUpdate(smsUpdated) {
    $rootScope.$broadcast('update-sms', smsUpdated);
  }

  function updateUser(userUpdated) {
    $rootScope.$broadcast('update-user', userUpdated);
  }

  function updateMeter(meterUpdated) {
    $rootScope.$broadcast('update-meter', meterUpdated);
  }

  function updateAccount(accountUpdated) {
    $rootScope.$broadcast('update-account', accountUpdated);
  }

  function individualAccountUpdate() {
    $rootScope.$broadcast('individual-account');
  }

  function updateTransactions() {
    $rootScope.$broadcast('update-transactions');
  }

  function updateDashboard() {
    $rootScope.$broadcast('update-dashboard');
  }

  function refreshButton() {
    if ($rootScope.page === 'user') {
      updateUser();
    } else if ($rootScope.page === 'meter') {
      updateMeter();
    } else if ($rootScope.page === 'individualMeter') {
      individualMeterMessageUpdate();
    } else if ($rootScope.page === 'individualAccount') {
      individualAccountUpdate();
    } else if ($rootScope.page === 'sms') {
      smsUpdate();
    } else if ($rootScope.page === 'updateTransactions') {
      updateTransactions();
    } else if ($rootScope.page === 'dashboard') {
      updateDashboard();
    } else {
      updateAccount();
    }
  }

  function select(item) {
    $scope.selected = item;
  }

  function displayNavbar(language) {

    if (language == 'fr') {
      $scope.datalists = [
        {"name": 'ACCUEIL', "link": "#/dashboards", "Acl": "accountPage"},
        {"name": 'CLIENTS', "link": "#/accounts", "Acl": "accountPage"},
        {"name": 'CARTE', "link": "#/maps", "Acl": "mapPage"},
        {"name": 'CT BOX', "link": "#/meters", "Acl": "meterPage"},
        {"name": 'UTILISATEURS', "link": "#/users", "Acl": "userPage"},
        {"name": 'SMS', "link": "#/sms", "Acl": "smsPage"},
        {"name": 'EVENTS', "link": "#/accounts/events", "Acl": "account_events_details"}
      ];
    } else {
      $scope.datalists = [
        {"name": 'HOME', "link": "#/dashboards", "Acl": "accountPage"},
        {"name": 'CUSTOMERS', "link": "#/accounts", "Acl": "accountPage"},
        {"name": 'MAP', "link": "#/maps", "Acl": "mapPage"},
        {"name": 'CT BOX', "link": "#/meters", "Acl": "meterPage"},
        {"name": 'USERS', "link": "#/users", "Acl": "userPage"},
        {"name": 'SMS', "link": "#/sms", "Acl": "smsPage"},
        {"name": 'EVENTS', "link": "#/accounts/events", "Acl": "account_events_details"}
      ];
    }
  }

  $scope.$on('french-language', function(event, args) {
    displayNavbar('fr');
  });

  $scope.$on('english-language', function(event, args) {
    displayNavbar('en');
  });


  function authenticationActive() {
    if (!config().headers.Authorization || $location.path() === '/login') {
      $rootScope.authenticate = false;
      $location.path('/login');
    } else {
      $rootScope.authenticate = true;
      $scope.path             = apiURL;
    }
  }

  function isActive(item) {
    return $scope.selected === item;
  }

  var datalistsPath = {
    dashboards: $scope.datalists[0],
    accounts: $scope.datalists[1],
    maps: $scope.datalists[2],
    meters: $scope.datalists[3],
    users: $scope.datalists[4],
    sms: $scope.datalists[5]
  };
  $scope.selected   = datalistsPath[$location.url().split('/')[1]];


  function disconnect() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    AclService.detachRole($rootScope.role);
    authenticationActive();
    $location.path('/');
  }

  authenticationActive();
}