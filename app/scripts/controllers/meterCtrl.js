angular.module('citytaps').controller('meterCtrl', meterCtrl);

meterCtrl.$inject = ['AclService', 'meter', '$scope', '$rootScope', '$location', 'orderByFilter', '$translate'];

function meterCtrl(AclService, meter, $scope, $rootScope, $location, orderBy, $translate) {

  $rootScope.page      = 'meter';
  $scope.can           = AclService.can;
  $scope.refreshButton = refreshButton;
  var meterCacheName   = 'meterCache';

  if (sessionStorage.getItem(meterCacheName)) {
    $scope.meters = JSON.parse(sessionStorage.getItem(meterCacheName));
  }

  function refreshButton() {
    updateMeter();
  }


  var dontShowToast = true;
  updateMeter(dontShowToast);

  if ($rootScope.meterDeleted) {
    alertify.success($translate.instant('ALERT.INDIVIDUAL_METER.DELETED'));
  }

  function displayErrorMessage(error, status) {
    $scope.errorMessage = 'An error occured: please reload the page!';
    if (error.message === "invalidToken") {
      $location.path('/login');
    }
  }

  $scope.showDetails = function(id) {
    $location.path('/meters/' + id);
  };

  $scope.hoveredCol  = null;
  $scope.hoveredRow  = null;
  $scope.mouseOverTd = function(row) {
    $scope.hoveredRow = row;
  };

  function meterUpdates(meterResults) {
    $rootScope.lastTimeRefresh = Date.now();
    $scope.propertyName = 'serial';
    $scope.reverse      = false;
    $scope.meters       = orderBy(meterResults, 'serial', $scope.reverse);
    sessionStorage.setItem(meterCacheName, JSON.stringify($scope.meters));
    sessionStorage.setItem(meterCacheName + 'timestamp', Date.now());
  }

  $scope.sortBy = function(propertyName) {
    $scope.reverse      = (propertyName !== null && $scope.propertyName === propertyName)
      ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
    $scope.meters       = orderBy($scope.meters, $scope.propertyName, $scope.reverse);
  };

  function endLoading(show) {
    if (!show) {
      alertify.success($translate.instant('PAGE_UPDATED'));
    }
  }

  var meters = null;

  $scope.$on('update-meter', function(event, args) {
    updateMeter();
  });

  function updateMeter(dontShowToast) {
    meter.update($scope).then(meterUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading(dontShowToast));
  }
}