angular.module('citytaps').controller('newMeterCtrl', newMeterCtrl);

newMeterCtrl.$inject = ['meter', '$scope', '$rootScope', '$location'];

function newMeterCtrl(meter, $scope, $rootScope, $location) {

  $scope.alert = false;
  $rootScope.noRefresh = true;
  $scope.saveMeter = saveMeter;
  $scope.json = {};
  $scope.json.offset = 0;
  function endLoading() {
  }

  function displayErrorMessage(error, status) {
    $scope.errorMessage = 'An error occured: please reload the page!';
    if (error.message === "invalidToken") {
      $location.path('/login');
    }
  }

  function meterSaved(savedMeter) {
    $rootScope.lastTimeRefresh = Date.now();
    $rootScope.meterSaved = true;
    $location.path('/meters/' + savedMeter.serial);
  }

  function saveMeter() {
    meter.save($scope.json)
      .then(meterSaved)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

}