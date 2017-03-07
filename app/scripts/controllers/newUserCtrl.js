angular.module('citytaps').controller('newUserCtrl', newUserCtrl);

angular.module('citytaps').filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);

      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});

newUserCtrl.$inject = ['$scope', '$http', 'apiURL', 'individualUser', '$rootScope', '$location', 'AclService'];

function newUserCtrl($scope, $http, apiURL, individualUser, $rootScope, $location, AclService) {

  $scope.permissions = [
    {role: 'SuperAdmin'},
    {role: 'Admin'},
    {role: 'CustomerManager'},
    {role: 'Reader'},
    {role: 'SMS_server'},
    {role: 'MQTT_listener'},
    {role: 'CronService'}
  ];

  $scope.languages = [
    {language: 'en'},
    {language: 'fr'}
  ];

  $scope.alert         = false;
  $scope.saveUser      = saveUser;
  $scope.can           = AclService.can;
  $rootScope.noRefresh = true;

  function userSaved(savedUser) {
    $rootScope.lastTimeRefresh = Date.now();
    $rootScope.userSaved   = true;
    $rootScope.userDeleted = false;
    $location.path('/users');
  }

  function endLoading() {
  }

  function displayErrorMessage(error, status) {
    $scope.errorMessage = 'An error occured: please reload the page!';
    if (error.message === "invalidToken") {
      $location.path('/login');
    }
  }

  function saveUser() {
    $scope.json.role     = $scope.json.permission.role;
    $scope.json.language = $scope.json.languages.language;
    individualUser.save($scope.json)
      .then(userSaved)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }
}