angular.module('citytaps').controller('individualAccountCtrl', individualAccountCtrl);

individualAccountCtrl.$inject = ['AclService', 'account', '$scope', '$rootScope', 'individualAccount', '$routeParams', '$location', '$log', '$uibModal', '$translate'];

function individualAccountCtrl(AclService, account, $scope, $rootScope, individualAccount, $routeParams, $location, $log, $uibModal, $translate) {
  $scope.can            = AclService.can;
  $scope.deleteAccount  = deleteAccount;
  $rootScope.noRefresh  = true;
  $scope.modalActive    = true;
  $scope.alert          = false;
  $rootScope.page       = 'individualAccount';
  $scope.open           = open;
  $scope.openStatus     = openStatus;
  $scope.openPhone      = openPhone;
  $scope.openBilling    = openBilling;
  $scope.openResetCycle = openResetCycle;
  $scope.openSendSMS    = openSendSMS;
  $scope.resetCycles    = resetCycles;
  var showAlert         = true;

  $scope.$on('individual-account', function(event, args) {
    updateAccount(showAlert);
  });

  updateAccount();

  function resetCycles() {
    individualAccount.resetCycles($routeParams.id)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function openBilling(size) {
    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/modals/myModalBillingContent.html',
      controller: 'ModalInstanceBillingCtrl',
      size: size,
      resolve: {
        account: function() {
          return $scope.json;
        }
      }
    });

    modalInstance.result.then(function(account) {
      updateAccount(showAlert);
      // alertify.success($translate.instant('ALERT.INDIVIDUAL_ACCOUNT.SAVED'));
    }, function() {
      updateAccount(showAlert);
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  function openResetCycle(size) {
    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/modals/myModalResetCycles.html',
      controller: 'modalInstanceResetCycleCtrl',
      size: size,
      resolve: {
        account: function() {
          return $scope.json;
        }
      }
    });

    modalInstance.result.then(function(account) {
      updateAccount(showAlert);
    }, function() {
      updateAccount(showAlert);
      $log.info('Modal dismissed at: ' + new Date());
    });
  }


  function open(size) {
    var vm            = this;
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/modals/myModalContent.html',
      controller: 'ModalInstanceCtrl as vm',
      size: size,
      resolve: {
        account: function() {
          return vm;
        }
      }
    });

    modalInstance.result.then(function(account) {
      delete account.account;
      individualAccount.saveAccount($routeParams.id, account)
        .catch(displayErrorMessage)
        .finally(endLoading);
      updateAccount(showAlert);
      // alertify.success($translate.instant('ALERT.INDIVIDUAL_ACCOUNT.SAVED'));
    }, function() {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  function openStatus(size) {
    swal({
      title: 'Are you sure?',
      text: "This action will change the payment status!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change the payment status!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false
    }).then(function() {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'templates/modals/myModalStatusContent.html',
        controller: 'ModalInstanceStatusCtrl',
        size: size,
        resolve: {
          account: function() {
            return $scope.json;
          }
        }
      });

      modalInstance.result.then(function(value) {
      }, function() {
        updateAccount(showAlert);
        $log.info('Modal dismissed at: ' + new Date());
      });

    }, function(dismiss) {

      if (dismiss === 'cancel') {
        swal('Cancel', "", 'error');
      }
    });

  }

  function openPhone(size) {

    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/modals/myModalPhoneContent.html',
      controller: 'ModalInstancePhoneCtrl',
      size: size,
      resolve: {
        attached_phone_numbers: function() {
          return $rootScope.attached_phone_numbers;
        }
      }
    });

    modalInstance.result.then(function(account) {
      alertify.success($translate.instant('ALERT.INDIVIDUAL_ACCOUNT.SAVED'));
    }, function() {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  function openSendSMS(size) {
    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/modals/myModalSendSMSContent.html',
      controller: 'ModalInstanceSendSMSCtrl',
      size: size,
      resolve: {
        account: function() {
          return $scope.json;
        }
      }
    });

    modalInstance.result.then(function(account) {
      alertify.success($translate.instant('ALERT.SMS.SENT'));
    }, function() {
      updateAccount(showAlert);
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  $scope.id = $routeParams.id;

  function displayErrorMessage(error, status) {
    $rootScope.hideTable          = true;
    if (!error) {
      alertify.error($translate.instant('API_PROBLEM'));
      
    }
    if (error && error.message === "invalidToken") {
      $location.path('/login');
    }
  }

  $scope.$on('individual-account', function(event) {
    updateAccount(showAlert);
  });

  function endLoading(doYouShowAlert) {
    if (doYouShowAlert) {
      alertify.success($translate.instant('PAGE_UPDATED'));
    }
  }

  function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function accountUpdates(accountResults) {
    angular.forEach(accountResults, function(value, key) {
      if (value.debit7Days) {
        $scope.debitSevenLastDays  = Math.floor(value.debit7Days);
      }
      if (value.credit7Days) {
        $scope.creditSevenLastDays = Math.floor(value.credit7Days);
      }
      if (value.debit30Days) {
        $scope.debitOneMonth = Math.floor(value.debit30Days);
      }
      if (value.credit30Days) {
        $scope.creditOneMonth = Math.floor(value.credit30Days);
      }
      if (value && value.accountMeter) {
        $scope.json = value.accountMeter;
      }
      if (value && value.accountMeter) {
        $scope.amount   = value.accountMeter.transactions[0].amount;
        $scope.lastDate = value.accountMeter.transactions[0].timestamp;
      }
      if (value && value.accountMeter) {
        $scope.current_credit = numberWithSpaces(parseInt(value.accountMeter.current_credit));
      }
      if (value && value.accountMeter) {
        $scope.payment_enabled = value.accountMeter.payment_enabled ? 1 : 0;
      }
      if (value && value.consumptionSum7Days) {
        $scope.consumptionSevenLastDays = value.consumptionSum7Days;
      }
      if (value && value.consumptionSum30Days) {
        $scope.consumptionLastMonth = value.consumptionSum30Days;
      }
    });
    $rootScope.lastTimeRefresh = Date.now();
  }

  function deleteAccount() {
    individualAccount.destroy($routeParams.id)
      .catch(displayErrorMessage)
      .finally(endLoading);
    updateAccount(showAlert);
  }

  function attachedPhoneNumberUpdate(updatedAttachedPhoneNumber) {
    if (updatedAttachedPhoneNumber.length > 0) {
      $rootScope.attached_phone_numbers = updatedAttachedPhoneNumber;
      $rootScope.hideTable              = false;
    } else {
      $rootScope.hideTable = true;
    }
  }

  function updateAccount(doYouShowAlert) {
    individualAccount.update($routeParams.id)
      .then(accountUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading(doYouShowAlert));

    individualAccount.getAttachedPhoneNumbers($routeParams.id)
      .then(attachedPhoneNumberUpdate)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }
}