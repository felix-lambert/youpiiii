angular.module('citytaps').controller('ModalInstanceCtrl', ModalInstanceCtrl);

ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'account'];

function ModalInstanceCtrl($scope, $uibModalInstance, account) {

  var vm = this;
  vm.account = account.json;

  vm.first_name             = account.json.first_name;
  vm.last_name              = account.json.last_name;
  vm.subscription_fee       = account.json.subscription_fee;
  vm.subscription_daily_fee = account.json.subscription_daily_fee;
  vm.payment_enabled        = account.json.payment_enabled;
  vm.test_account           = account.json.test_account;
  vm.utility_identifier     = account.json.utility_identifier;
  vm.gps_lon                = account.json.gps_lon;
  vm.contact_email          = account.json.contact_email;
  vm.address                = account.json.address;
  vm.zipcode                = account.json.zipcode;
  vm.city                   = account.json.city;
  vm.contact_phone_number   = account.json.contact_phone_number;


  $scope.ok     = ok;
  $scope.cancel = cancel;

  function ok() {
    $uibModalInstance.close(vm);
  }

  function cancel() {
    $uibModalInstance.dismiss('cancel');
  }
}
