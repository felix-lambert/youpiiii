//Accounts
angular.module('citytaps').controller('accountCtrl', accountCtrl);

accountCtrl.$inject = ['AclService', 'account', '$scope', '$rootScope', '$location', '$uibModal', '$translate'];

function accountCtrl(AclService, account, $scope, $rootScope, $location, $uibModal, $translate) {

  $rootScope.page           = 'account';
  $scope.can                = AclService.can;
  $scope.accountView        = 'Reader';
  $scope.accountView        = accountView;
  $scope.saveThisView       = saveThisView;
  $scope.deductCurrentPrice = deductCurrentPrice;
  $scope.refreshButton      = refreshButton;
  var accountCacheName      = 'accountCache';

  if (sessionStorage.getItem(accountCacheName)) {
    $scope.json = JSON.parse(sessionStorage.getItem(accountCacheName));
  }

  var dontShowToast = true;
  updateAccount(dontShowToast);

  if ($rootScope.meterDeleted) {
    alertify.error($translate.instant('METER.DELETED'));
  }

  function refreshButton() {
    updateAccount();
  }

  function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  $scope.showDetails = function(id) {
    if (AclService.can('accountDetails')) {
      $location.path('/accounts/' + id);
    }
  };

  $scope.newAccount = function() {
    $location.path('/accounts/new');
  };

  $scope.hoveredCol  = null;
  $scope.hoveredRow  = null;
  $scope.mouseOverTd = function(row) {
    $scope.hoveredRow = row;
  };

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

  function accountUpdates(accountResults) {
    for (var i = 0; i < accountResults.length; i++) {
      if (accountResults[i].current_credit) {
        accountResults[i].current_credit            = Math.floor(accountResults[i].current_credit);
        accountResults[i].current_credit_with_space = numberWithSpaces(accountResults[i].current_credit);
      }
      if (accountResults[i].meters[0] &&
        accountResults[i].meters[0].last_connection) {
        //todays date
        var now      = moment(new Date());
        var end      = moment(accountResults[i].meters[0].last_connection * 1000); // another date
        var duration = moment.duration(now.diff(end));
        var hours    = duration.asHours();
        if (hours >= 2 && hours <= 24) {
          accountResults[i].backgroundImageInfo = "orange";
        } else if (hours >= 24) {
          accountResults[i].backgroundImageInfo = "red";
        }
      }
      if (accountResults[i].meters[0] &&
        accountResults[i].meters[0].valve_status === 1) {
        accountResults[i].valve_status = $translate.instant('1');
      } else if (accountResults[i].meters[0] &&
        accountResults[i].meters[0].valve_status === 0) {
        accountResults[i].valve_status = $translate.instant('0');
      } else {
        accountResults[i].valve_status = 'No data';
      }
    }
    $scope.json = accountResults;
    sessionStorage.setItem(accountCacheName, JSON.stringify(accountResults));
    sessionStorage.setItem(accountCacheName + 'timestamp', Date.now());
    $rootScope.lastTimeRefresh = Date.now();
  }

  $scope.$on('update-account', function(event, args) {
    $scope.accounts = args;
    updateAccount();
  });

  function updateAccount(dontShowToast) {
    account.update().then(accountUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading(dontShowToast));
  }

  $(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
    $('.dropdown-toggle').dropdown();
  });

  $scope.accountAclTab = {
    Reader: {
      cin: false,
      safege: true,
      name: true,
      balance: true,
      volumeConsummed: true,
      cycleConsumption: true,
      serialNumber: false,
      valveState: true,
      lastBoxMessage: false,
      mechanicalIndex: true,
      indexName: 'Index',
      details: true,
      accountTest: false,
      viewLocalStorage: "Reader",
      viewName: $translate.instant('ACCOUNT_BUTTON_CHANGE_VIEW.READER'),
      viewNameButton: $translate.instant('ACCOUNT_BUTTON_CHANGE_VIEW.READER'),
      colspan: 2
    },
    Management: {
      cin: true,
      safege: true,
      name: true,
      balance: true,
      volumeConsummed: true,
      cycleConsumption: true,
      serialNumber: true,
      valveState: true,
      lastBoxMessage: false,
      mechanicalIndex: true,
      indexName: 'Index',
      details: true,
      accountTest: true,
      viewLocalStorage: "Management",
      viewName: $translate.instant('ACCOUNT_BUTTON_CHANGE_VIEW.MANAGEMENT'),
      viewNameButton: $translate.instant('ACCOUNT_BUTTON_CHANGE_VIEW.MANAGEMENT'),
      colspan: 3
    },
    Hardware: {
      cin: true,
      safege: false,
      name: true,
      balance: true,
      volumeConsummed: false,
      cycleConsumption: false,
      serialNumber: true,
      valveState: true,
      lastBoxMessage: true,
      mechanicalIndex: false,
      indexName: $translate.instant('MECHANICAL_INDEX'),
      details: true,
      accountTest: true,
      viewLocalStorage: "Hardware",
      viewName: $translate.instant('ACCOUNT_BUTTON_CHANGE_VIEW.HARDWARE'),
      viewNameButton: $translate.instant('ACCOUNT_BUTTON_CHANGE_VIEW.HARDWARE'),
      colspan: 3
    },
    Complete: {
      cin: true,
      safege: true,
      name: true,
      balance: true,
      volumeConsummed: true,
      cycleConsumption: true,
      serialNumber: true,
      valveState: true,
      lastBoxMessage: true,
      mechanicalIndex: true,
      indexName: $translate.instant('MECHANICAL_INDEX'),
      details: true,
      accountTest: true,
      viewLocalStorage: "Complete",
      viewName: $translate.instant('ACCOUNT_BUTTON_CHANGE_VIEW.COMPLETE'),
      viewNameButton: $translate.instant('ACCOUNT_BUTTON_CHANGE_VIEW.COMPLETE'),
      colspan: 4
    }
  };

  if ($scope.can('accountDetails')) {
    if (!localStorage.getItem('accountView') || localStorage.getItem('accountView') === 'SEEN') {
      localStorage.setItem('accountView', 'Reader');
      $scope.view           = 'Reader';
      $scope.viewNameButton = $scope.accountAclTab.Reader.viewNameButton;
    } else {
      $scope.view           = localStorage.getItem('accountView');
      $scope.viewNameButton = $scope.accountAclTab[$scope.view].viewNameButton;
    }
  } else {
    $scope.view = 'Reader';
    localStorage.setItem('accountView', 'Reader');
    $scope.viewNameButton = $scope.accountAclTab[$scope.view].viewNameButton;
  }

  function accountView(view) {
    $scope.view           = view;
    $scope.viewNameButton = $scope.accountAclTab[$scope.view].viewNameButton;
  }

  function saveThisView() {
    localStorage.setItem('accountView', $scope.view);
  }

  function deductCurrentPrice(cycleCumulatedConsumption) {
    // Find current price level based on cycle cumulated consumption
    var level = 0;
    while (cycleCumulatedConsumption > waterPrices[level].maxVolume) {
      level++;
    }
    return waterPrices[level];
  }
}

const waterPrices = [
  {
    "level": 0,
    "price": 127,
    "maxVolume": 10000
  },
  {
    "level": 1,
    "price": 321,
    "maxVolume": 40000
  },
  {
    "level": 2,
    "price": 515,
    "maxVolume": 50000
  },
  {
    "level": 3,
    "price": 612.85,
    "maxVolume": 100000000000
  }
];