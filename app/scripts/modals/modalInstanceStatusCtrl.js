
angular.module('citytaps').controller('ModalInstanceStatusCtrl', ModalInstanceStatusCtrl);

ModalInstanceStatusCtrl.$inject = ['$http', 'apiURL', '$routeParams', '$scope', '$uibModalInstance', 'account'];

function ModalInstanceStatusCtrl($http, apiURL, $routeParams, $scope, $uibModalInstance, account) {
  if (account.payment_enabled) {
    account.payment_enabled = 'Yes';
  } else {
    account.payment_enabled = 'No';
  }

  $scope.account = account;
  $scope.cancel  = cancel;

  function displayErrorMessage(error, status) {
    $scope.errorMessage = 'An error occured: please reload the page!';
  }

  function endLoading() {
    $scope.lastTimeRefresh = Date.now();
  }

  $scope.getVal = function(id, val) {
    $http.post(apiURL + '/v1/accounts/' + $routeParams.id + '/enablePayment', {"enablePayment": val}, config())
    .catch(displayErrorMessage)
    .finally(endLoading);
  }

  function cancel() {
    $uibModalInstance.dismiss('cancel');
  }
}
