angular.module('citytaps').controller('dashboardCtrl', dashboardCtrl);

dashboardCtrl.$inject = ['$scope', 'account', '$rootScope', '$translate', 'apiURL', '$http', '$timeout', '$q'];
function dashboardCtrl($scope, account, $rootScope, $translate, apiURL, $http, $timeout, $q) {
  $rootScope.page = 'dashboard';
  function config() {
    return {headers: {'Authorization': localStorage.getItem('token')}}
  }

  const scopeDatas = [
    'cash30Days',
    'cash7Days',
    'cash1Day',
    'water30Days',
    'water7Days',
    'water1Day',
    'disconnect30Days',
    'disconnect7Days',
    'disconnect1Days',
    'disconnected',
    'disconnectTime30Days',
    'disconnectTime7Days',
    'disconnectTime1Day',
    'currentCreditSum',
    'lowCredit'];

  var dashboardCacheName = 'dashboardCache';

  //init scope before received dashboard data
  scopeDatas.forEach(function(data) {
    $scope[data] = '-';
  });

  if (sessionStorage.getItem(dashboardCacheName)) {
    var dashboardDataObject = JSON.parse(sessionStorage.getItem(dashboardCacheName));
    scopeDatas.forEach(function(data) {
      $scope[data] = dashboardDataObject[data];
    })
  }

  var dontShowToast = true;
  updateDasboard(dontShowToast);

  $scope.$on('update-dashboard', function(event, args) {
    updateDasboard();
  });


  function displayErrorMessage(error, status) {
    if (!error) {
      alertify.error($translate.instant('API_PROBLEM'));

    }
    if (error && error.message === "invalidToken") {
      $location.path('/login');
    }
  }


  function endLoading(show) {
    if (!show) {
      alertify.success($translate.instant('PAGE_UPDATED'));
    }
  }

  function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function updateDasboard(dontShowToast) {
    var deferred = $q.defer();

    $timeout(function() {
      $scope.dataHasLoaded = true;
      deferred.resolve(); // this aborts the request!
    }, 1000);

    $http.get(apiURL + '/v1/accounts/dashboards', {
      timeout: deferred.promise,
      headers: {'Authorization': localStorage.getItem('token')}
    })
      .then(function(accountResults) {
        accountResults = accountResults.data;
        angular.forEach(accountResults, function(value, key) {

          if (value.totalAmount30Days) {
            $scope.cash30Days = numberWithSpaces(value.totalAmount30Days);
          } else if (value.totalAmount7Days) {
            $scope.cash7Days = numberWithSpaces(value.totalAmount7Days);
          } else if (value.totalAmount1Day) {
            $scope.cash1Day = numberWithSpaces(value.totalAmount1Day);
          } else if (value.consumptionSum30Days) {
            var waterVolume    = value.consumptionSum30Days / 1000;
            waterVolume        = numberWithSpaces(waterVolume);
            $scope.water30Days = Math.round(waterVolume);
          } else if (value.consumptionSum7Days) {
            var waterVolume7  = value.consumptionSum7Days / 1000;
            waterVolume7      = numberWithSpaces(waterVolume7);
            $scope.water7Days = Math.round(waterVolume7);
          } else if (value.consumptionSum1Day) {
            var waterVolume1 = value.consumptionSum1Day / 1000;
            waterVolume1     = numberWithSpaces(waterVolume1);
            $scope.water1Day = Math.round(waterVolume1);
          } else if (value.countValveStatus30Days) {
            $scope.disconnect30Days = numberWithSpaces(value.countValveStatus30Days);
          } else if (value.countValveStatus7Days) {
            $scope.disconnect7Days = numberWithSpaces(value.countValveStatus7Days);
          } else if (value.countValveStatus1Day) {
            $scope.disconnect1Day = numberWithSpaces(value.countValveStatus1Day);
          } else if (value.closedValveCount) {
            $scope.disconnected = numberWithSpaces(value.closedValveCount);
          } else if (value && value.elapsed_hour30Days) {
            var disconnect30            = value.elapsed_hour30Days / $scope.disconnect30Days;
            $scope.disconnectTime30Days = numberWithSpaces(Math.floor(disconnect30));
          } else if (value && value.elapsed_hour7Days) {
            var disconnect7            = value.elapsed_hour7Days / $scope.disconnect7Days;
            $scope.disconnectTime7Days = numberWithSpaces(Math.floor(disconnect7));
          } else if (value && value.elapsed_hour1Day) {
            var disconnect1           = value.elapsed_hour1Day / $scope.disconnect1Day;
            $scope.disconnectTime1Day = numberWithSpaces(Math.floor(disconnect1));
          } else if (value && value.currentCreditSum) {
            $scope.currentCreditSum = numberWithSpaces(Math.floor(value.currentCreditSum));
          } else if (value && value.nbLowCredit) {
            $scope.lowCredit = numberWithSpaces(Math.floor(value.nbLowCredit));
          }
        });
        var dashboardDataObject = {};
        scopeDatas.forEach(function(data) {
          if ($scope[data] === '-') {
            $scope[data] = 0;
          }
          dashboardDataObject[data] = $scope[data];
          sessionStorage.setItem(dashboardCacheName, JSON.stringify(dashboardDataObject));
          sessionStorage.setItem(dashboardCacheName + 'timestamp', Date.now());
        });

        $rootScope.lastTimeRefresh = Date.now();
      }, function(reject) {
        // error handler
        if (reject.status === 0) {
          // $http timeout
        } else {
          // response error status from server
          $scope.errorMessage = 'An error occured: please reload the page!';
          if (error.message === "invalidToken") {
            $location.path('/login');
          }
        }
      });
  }


}
