//Accounts
angular.module('citytaps').controller('newAccountCtrl', newAccountCtrl);

newAccountCtrl.$inject = ['account', '$scope', '$rootScope', '$location'];

function newAccountCtrl(account, $scope, $rootScope, $location) {


  $scope.saveAccount   = saveAccount;
  $rootScope.noRefresh = true;

  function displayErrorMessage(error, status) {
     $scope.errorMessage = 'An error occured: please reload the page!';
    if(error.message === "invalidToken"){
      $location.path('/login');
    }
  }

  function endLoading() {
  }

  function accountSaved(savedAccount) {
    $rootScope.lastTimeRefresh = Date.now();
    $rootScope.accountSaved = true;
    $location.path('/accounts/');
  }

  function saveAccount() {
    account.save($scope.json).then(accountSaved)
    .catch(displayErrorMessage)
    .finally(endLoading);
  }

}