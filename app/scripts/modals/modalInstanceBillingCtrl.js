angular.module('citytaps').controller('ModalInstanceBillingCtrl', ModalInstanceBillingCtrl);

ModalInstanceBillingCtrl.$inject = ['individualAccount', '$routeParams', '$scope', '$uibModalInstance', 'account', '$translate'];

function ModalInstanceBillingCtrl(individualAccount, $routeParams, $scope, $uibModalInstance, account, $translate) {

  $scope.account   = account;
  $scope.ok        = ok;
  $scope.cancel    = cancel;
  $scope.addCredit = addCredit;

  function creditUpdated(creditToAdd) {
    $scope.account.current_credit = $scope.account.current_credit + creditToAdd.credit;
    $scope.creditAddWithSuccess   = true;
    $scope.creditAddWithFail      = false;
  }

  function creditFail() {
    $scope.creditAddWithFail    = true;
    $scope.creditAddWithSuccess = false;

    $uibModalInstance.dismiss('cancel');
    alertify.error($translate.instant('ALERT.BILLING_MODAL.UPDATED_ERROR'));
  }

  function endLoading() {
  }

  function addCredit(credit) {
    individualAccount.addCredit($routeParams.id, credit)
      .then(creditUpdated)
      .catch(creditFail)
      .finally(endLoading);

    $scope.current_credit = null;
    alertify.success($translate.instant('ALERT.BILLING_MODAL.CREDIT_ADDED') + credit);
  }

  function ok() {
    $uibModalInstance.close($scope.account);
  }

  function cancel() {
    $uibModalInstance.dismiss('cancel');
  }
}
