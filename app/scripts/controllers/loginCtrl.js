//Accounts
angular.module('citytaps').controller('loginCtrl', loginCtrl);

loginCtrl.$inject = ['$scope', '$location', 'user', '$rootScope'];

function loginCtrl($scope, $location, user, $rootScope) {

  $scope.login         = login;
  $scope.master        = {};
  $scope.reset         = reset;
  $rootScope.noRefresh = true;
  $scope.loginPage     = true;

  function displayErrorMessage(error, status) {
    $scope.alert = true;
    alertify.error(error ? error.error : 'Login error');
    $scope.errorMessage = error ? error.error : 'Login error';
  }

  function endLoading() {
  }

  function loginRes(userLogged) {
    $rootScope.lastTimeRefresh = Date.now();
    localStorage.setItem('token', userLogged.token);
    localStorage.setItem('role', userLogged.role);
    localStorage.setItem('language', userLogged.language || 'en');

    $rootScope.authenticate = true;
    $rootScope.noRefresh    = false;
    if (localStorage.getItem('language') === 'fr') {
      $rootScope.$broadcast('french-language');
    } else {
      $rootScope.$broadcast('english-language');
    }
    
    $location.path('/dashboards');
  }

  function login(userForm) {
    $scope.master = angular.copy(userForm);
    user.login(userForm)
    .then(loginRes)
    .catch(displayErrorMessage)
    .finally(endLoading);
  }
  
  function reset() {
    $scope.user = angular.copy($scope.master);
  }

  $scope.alert = false;
  $scope.reset();
}