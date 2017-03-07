angular.module('citytaps').controller('ModalInstancePhoneCtrl', ModalInstancePhoneCtrl);

ModalInstancePhoneCtrl.$inject = ['$rootScope', '$routeParams', 'individualAccount', '$scope', '$uibModalInstance', 'attached_phone_numbers', '$translate'];

function ModalInstancePhoneCtrl($rootScope, $routeParams, individualAccount, $scope, $uibModalInstance, attached_phone_numbers, $translate) {

  $scope.attached_phone_numbers    = attached_phone_numbers;
  $scope.ok                        = ok;
  $scope.cancel                    = cancel;
  $scope.addAttachedPhoneNumber    = addAttachedPhoneNumber;
  $scope.deleteAttachedPhoneNumber = deleteAttachedPhoneNumber;

  function ok() {
    $uibModalInstance.close($scope.account);
  }

  function updateAttachedPhoneNumbers(phoneNumbers) {
    individualAccount.getAttachedPhoneNumbers($routeParams.id)
      .then(attachedPhoneNumberUpdate)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function deleteAttachedPhoneNumber(attachedPhoneNumberID) {
    individualAccount.deleteAttachedPhoneNumber($routeParams.id, attachedPhoneNumberID)
      .then(updateAttachedPhoneNumber)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function endLoading() {

  }

  function displayErrorMessage(error, status) {
    alertify.error($translate.instant('ALERT.PHONE_MODAL.ERROR'));
  }

  function attachedPhoneNumberUpdate(updatedAttachedPhoneNumber) {

    if (updatedAttachedPhoneNumber.length > 0) {
      $rootScope.hideTable = false;
    } else {
      $rootScope.hideTable = true;
    }
    $rootScope.attached_phone_numbers = updatedAttachedPhoneNumber;
    $scope.attached_phone_numbers     = $rootScope.attached_phone_numbers;
    angular.forEach($scope.attached_phone_numbers, function(attached, index) {
      if (attached.phone_numbers === "") {
        $scope.attached.splice(index, 1);
      }

    });
    alertify.success($translate.instant('ALERT.PHONE_MODAL.ADDED'));
  }

  function addAttachedPhoneNumber(attachedPhoneNumberToAdd) {
    individualAccount.addAttachedPhoneNumber($routeParams.id, attachedPhoneNumberToAdd)
      .then(updateAttachedPhoneNumber)
      .catch(displayErrorMessage)
      .finally(endLoading);
    $scope.attachedPhoneNumberToAdd = null;
  }

  function updateAttachedPhoneNumber() {
    individualAccount.getAttachedPhoneNumbers($routeParams.id)
      .then(attachedPhoneNumberUpdate)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function cancel() {
    $uibModalInstance.dismiss('cancel');
  }
}