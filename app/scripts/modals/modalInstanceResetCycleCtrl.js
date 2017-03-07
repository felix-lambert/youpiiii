angular.module('citytaps').controller('modalInstanceResetCycleCtrl', modalInstanceResetCycleCtrl);

modalInstanceResetCycleCtrl.$inject = ['$uibModalInstance', '$scope', '$routeParams', 'account', 'individualAccount', '$translate'];

function modalInstanceResetCycleCtrl($uibModalInstance, $scope, $routeParams, account, individualAccount, $translate) {

  $scope.account          = account;
  $scope.ok               = ok;
  $scope.cancelResetCycle = cancelResetCycle;
  $scope.resetCycle       = resetCycle;

  function cycleUpdated(creditToAdd) {
    $uibModalInstance.close($scope.account);
  }

  function cycleFail() {
    $uibModalInstance.dismiss('cancel');
    alertify.error($translate.instant('ALERT.RESET_CYCLE_MODAL.RESET_ERROR'));
  }

  function endLoading() {
    account.update();
  }

  function resetCycle(id) {
    individualAccount.resetCycles($routeParams.id)
      .then(cycleUpdated)
      .catch(cycleFail)
      .finally(endLoading);

    alertify.success($translate.instant('ALERT.RESET_CYCLE_MODAL.RESET'));
  }

  function ok() {
    $uibModalInstance.close($scope.account);
  }

  function cancelResetCycle() {
    $uibModalInstance.dismiss('cancel');
  }
}
