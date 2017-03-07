
angular.module('citytaps').controller('ModalInstanceSendSMSCtrl', ModalInstanceSendSMSCtrl);

ModalInstanceSendSMSCtrl.$inject = ['$http', 'apiURL', '$routeParams', '$scope', '$uibModalInstance', 'account'];

function ModalInstanceSendSMSCtrl($http, apiURL, $routeParams, $scope, $uibModalInstance, account) {
  $scope.account = account;
  $scope.cancel  = cancel;

  function config() {
    return {headers: {'Authorization': localStorage.getItem('token')}}
  }

  function displayErrorMessage(error, status) {
    $scope.errorMessage = 'An error occured: please reload the page!';
  }

  function endLoading() {
    $uibModalInstance.dismiss('cancel');
  }

  $scope.sendSMS = function(message) {
    var send = {
      message: message,
      phoneNumber: account.contact_phone_number
    };
    $http.post(apiURL + '/v1/accounts/' + $routeParams.id +  '/notifications/', send, config())
      .catch(displayErrorMessage)
      .finally(endLoading);;
  }

  function cancel() {
    $uibModalInstance.dismiss('cancel');
  }
}
