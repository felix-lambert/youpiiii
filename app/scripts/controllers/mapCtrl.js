//Maps
angular.module('citytaps').controller('mapCtrl', mapCtrl);

mapCtrl.$inject = ['$q', 'NgMap', 'account', '$scope', '$rootScope', '$location', '$translate'];

function mapCtrl($q, NgMap, account, $scope, $rootScope, $location, $translate) {

  $scope.readyForMap = false;

  update();

  $scope.$on('mapInitialized', function(event, map) {
    $scope.objMapa = map;
    map.setZoom(map.getZoom() - 1);
    map.setMapTypeId("satellite");
  });

  $scope.currentPin = {title: ""};

  $rootScope.page = 'account';

  var Gateway = {
    first_name: "Gateway",
    latitude: 13.534507,
    longitude: 2.079317,
    last_name: "Niger",
    meters: [],
    image: '/images/antenna.png'
  };

  function endLoading() {
  }

  $scope.showInfoWindow = function(event, p) {
    var infowindow      = new google.maps.InfoWindow();
    var center          = new google.maps.LatLng(p.latitude, p.longitude);
    var valveStatus     = "";
    var balance         = "";
    var payment_enabled = "";
    if (p.valve_status == 'Valve open') {
      valveStatus = "<p class='bg-success'>" + p.valve_status + "</p>"
    } else {
      valveStatus = "<div class='bg-danger'>" + p.valve_status + "</div>"
    }
    if (p.current_credit < 350 && p.current_credit > 0) {
      balance = "<p class='bg-warning'>" + p.current_credit + " CFA left</p>"
    } else if (p.current_credit <= 0) {
      balance = "<p class='bg-danger'>" + p.current_credit + " CFA left</p>"
    } else {
      balance = "<p class='bg-success'>" + p.current_credit + " CFA left</p>"
    }

    if (p.payment_enabled === 1) {
      payment_enabled = "<p class='bg-success'>" + "Payment is enabled" + "</p>"
    } else {
      payment_enabled = "<p class='bg-info'>" + "Payment is disabled" + "</p>"
    }
    var content = '';
    if (p.serial) {
      content = '<h4 style="color: black;">#' + p.cin + '<br/>' + p.first_name + ' ' + '<b>' + p.last_name + '</b>' + '</h4>' + 'Meter serial number: ' + p.serial + '</br>' + 'SAFEGE number: ' + p.safege + '' + payment_enabled + balance + valveStatus + '</p>';
    } else {
      content = '<h4 style="color: black;">' + p.first_name + ' ' + '<b>' + p.last_name + '</b>' + '</h4>'
    }
    infowindow.setContent(
      content
    );
    infowindow.setPosition(center);
    infowindow.open($scope.objMapa);
  };

  NgMap.getMap().then(function(map) {
    $rootScope.map = map;

  });

  $scope.hideDetail = function() {
    $scope.map.hideInfoWindow('iw');
  };


  function accountUpdates(accountResults) {
    $rootScope.lastTimeRefresh = Date.now();
    $scope.currentPin  = {title: ""};
    $scope.markerData  = [];
    $scope.readyForMap = true;
    for (var i = 0; i < accountResults.length; i++) {
      if (accountResults[i].gps_lat && accountResults[i].gps_lon && accountResults[i].meters[0]) {
        var accountData = {
          "cin": accountResults[i].id,
          "latitude": accountResults[i].gps_lat,
          "longitude": accountResults[i].gps_lon,
          "first_name": accountResults[i].first_name,
          "last_name": accountResults[i].last_name,
          "current_credit": Math.floor(accountResults[i].current_credit),
          "valve_status": accountResults[i].meters[0].valve_status === 1 ? 'Valve open' : 'Valve close',
          "serial": accountResults[i].meters[0].serial,
          "safege": accountResults[i].utility_identifier,
          "payment_enabled": accountResults[i].payment_enabled
        };

        if ((accountData.current_credit > 350 || !accountResults[i].payment_enabled) && accountResults[i].meters[0].valve_status === 1) {
          accountData.image = '/images/green-dot.png';
        } else if (accountResults[i].meters[0].valve_status === 1 && accountData.current_credit > 0) {
          accountData.image = '/images/yellow-dot.png';
        } else {
          accountData.image = '/images/red-dot.png';
        }

        $scope.markerData.push(accountData);

      }
    }
    $scope.markerData.push(Gateway);
    $scope.json = accountResults;
  }

  function displayErrorMessage(error, status) {
    $scope.errorMessage = 'An error occured: please reload the page!';
    if (error.message === "invalidToken") {
      $location.path('/login');
    }
  }


  $scope.$on('update-map', function(event, args) {
    $scope.accounts = args;
    update();
    alertify.success($translate.instant('PAGE_UPDATED'));
  });

  function update() {
    account.update().then(accountUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }
}