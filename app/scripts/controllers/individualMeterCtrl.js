angular.module('citytaps').controller('individualMeterCtrl', individualMeterCtrl);

individualMeterCtrl.$inject = ['AclService', 'account', '$scope', 'individualMeter', 'meterMessage', '$routeParams', '$location', '$rootScope', '$translate'];

function individualMeterCtrl(AclService, account, $scope, individualMeter, meterMessage, $routeParams, $location, $rootScope, $translate) {


  $(function() {
    $('#receive-form-link').click(function(e) {
      $("#receive-form").delay(100).fadeIn(100);
      $("#send-form").fadeOut(100);
      $('#send-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });
    $('#send-form-link').click(function(e) {
      $("#send-form").delay(100).fadeIn(100);
      $("#receive-form").fadeOut(100);
      $('#receive-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });

  });
  
  $scope.sendMessageToMeter = sendMessageToMeter;
  $scope.can                = AclService.can;
  $scope.modal              = modal;
  $scope.updateAccount      = updateAccount;
  $scope.closeModal         = closeModal;
  $scope.saveMeter          = saveMeter;
  $scope.deleteMeter        = deleteMeter;
  $scope.pagination         = pagination;
  $scope.paginationSent     = paginationSent;
  $rootScope.page           = 'individualMeter';
  $scope.showAccount        = showAccount;
  $scope.paginationCurrent  = 1;
  $scope.pageSize           = 50;
  $scope.pageSizeSent       = 50;
  
  var showAlert             = true;

  updateMeterAndMessages();

  $scope.$on('update-individual-meter', function(event, args) {
    $scope.meters = args;
    updateMeterAndMessages(showAlert);
  });

  if ($rootScope.meterSaved) {
    alertify.error($translate.instant('ALERT.METER.REDIRECTION'));
    alertify.success($translate.instant('ALERT.METER.SAVED'));
    $rootScope.meterSaved = false;
  }

  function accountUpdates(accountResults) {
    $scope.accounts = accountResults;
  }

  function showAccount() {
    $scope.linkAccount = true;
    account.update().then(accountUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function individualMeterUpdate(imu) {
    $rootScope.lastTimeRefresh = Date.now();
    $rootScope.lastTimeRefresh = Date.now();
    $scope.individualMeter = imu;
  }

  function accountJoined(res) {
    $rootScope.lastTimeRefresh = Date.now();
    updateMeterAndMessages();
    $scope.linkAccount = false;
  }

  function updateAccount(id) {
    var serial = $routeParams.serial;
    individualMeter.joinAccount({
      serial: serial,
      id: id
    }).then(accountJoined)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function meterMessageUpdate(mmu) {
    $rootScope.lastTimeRefresh = Date.now();
    $scope.paginationCurrent = $scope.currentPage;
    if (mmu) {
      mmu.forEach(function(object) {
        object.temperature = parseInt(object.decodedData.substr(0, 2), 16);
        object.water_index = parseInt(object.decodedData.substr(2, 7), 16) / 1000;
        var valve_ceiling  = parseInt(object.decodedData.substr(9, 7), 16);
        if (valve_ceiling > 0x7ffffff) {
          object.valve_status  = 1;
          object.index_ceiling = (valve_ceiling - 0x8000000) / 1000;
        } else {
          object.valve_status  = 0;
          object.index_ceiling = valve_ceiling / 1000;
        }
        object.wake_up_frequency = parseInt(object.decodedData.substr(16, 4), 16);


        switch (object.decodedData.charAt(0)) {
          case '0':
            object.indexType = 'Not changed water index';
            object.unit      = ' L';
            break;
          case '1':
            object.indexType = 'Water index';
            object.unit      = ' L';
            break;
          case '2':
            object.indexType = 'Temperature';
            object.unit      = '°C';
            break;
          case '3':
            object.indexType = 'Change of state';
            object.unit      = '';
            break;
          case '4':
            object.indexType = 'Join test';
            object.unit      = '';
            break;
          case '5':
            object.indexType = 'Credit available';
            object.unit      = '';
            break;
          case '6':
            object.indexType = 'Wake up frequency';
            object.unit      = 's';
            break;
          case '7':
            object.indexType = 'Battey state';
            object.unit      = '%';
            break;
          default:
            object.indexType = 'No type';
            object.unit      = '';
            return;
        };

        if (object.indexType === 'No type') {
          object.valveStatus = '0';
        } else {
          object.valveStatus = object.decodedData.charAt(1);
          object.decimalData = parseInt(object.decodedData.slice(2), 16);
          object.message     = JSON.parse(object.message);
        }
      });
      $scope.meterMessageData = mmu;
    }
  }

  function displayErrorMessage(error, status) {
    $scope.paginationCurrent      = 1;
    $scope.currentPage            = 1;
    $scope.currentPageSent        = 1;
    $scope.errorMessage           = 'An error occured: please reload the page!';
    $scope.requestSentToMeterFail = true;
    $scope.modalActive            = false;
    if (error.message === "invalidToken") {
      $location.path('/login');
    }
  }

  function endLoading(doYouShowAlert) {
    if (doYouShowAlert) {
      alertify.success($translate.instant('PAGE_UPDATED'));
    }
  }

  function meterSaved() {

  }

  function meterDeleted() {
    $rootScope.meterDeleted = true;
    $location.path('/meters');
  }

  function messageSent(sentMessage) {
    if (sentMessage.message === "success") {
      $scope.requestSentToMeterSuccess = true;
      $scope.modalActive               = false;
    }
    updateMeterAndMessages();
  }


  function sendMessageToMeter() {
    alertify.success($scope.typeOfMessage + ' is being activated');
    meterMessage.saveMessageToMeter($scope.typeOfMessage, $scope.payload, $routeParams.serial)
      .then(messageSent)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function modal(typeOfMessage) {
    $scope.typeOfMessage = typeOfMessage;
    if (typeOfMessage == 'updateIndexCeiling') {
      $scope.placeHolderPayload = "New index ceiling";
      $scope.needPayload        = true;
    } else if (typeOfMessage == 'setWakeupFrequency') {
      $scope.placeHolderPayload = "New wake up frequency";
      $scope.needPayload        = true;
    } else if (typeOfMessage == 'clearQueue') {
      $scope.placeHolderPayload = 'Clear Queue';
      $scope.needPayload        = false;
    } else {
      $scope.placeHolderPayload = false;
      $scope.needPayload        = false;
    }
    $scope.requestSentToMeterSuccess = false;
    $scope.requestSentToMeterFail    = false;
    $scope.modalActive               = true;
  }

  function closeModal() {
    $scope.modalActive = false;
  }

  function messageSaved() {
  }

  function saveMeter() {
    individualMeter.saveMeter($routeParams.serial, $scope.individualMeter)
      .then(messageSaved)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function deleteMeter() {
    individualMeter.deleteMeter($routeParams.serial, $scope.individualMeter)
      .then(meterDeleted)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  $scope.currentPage     = 1;
  $scope.currentPageSent = 1;

  function meterMessageSentUpdate(meterResult) {
    $rootScope.lastTimeRefresh = Date.now();
    $scope.paginationCurrent = $scope.currentPageSent;
    $scope.metersSent        = meterResult;
  }

  function pagination(paginationValue) {
    if (paginationValue === "1") {
      $scope.currentPage = 1;
    } else if (paginationValue === "more") {
      $scope.currentPage = $scope.currentPage + 1;
    } else if (paginationValue === "less") {
      $scope.currentPage = $scope.currentPage - 1;
      if ($scope.currentPage <= 1) {
        $scope.currentPage = 1
      }
    }

    meterMessage.updateMessage($routeParams.serial, $scope.pageSize, $scope.currentPage)
      .then(meterMessageUpdate)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function paginationSent(paginationValue) {
    if (paginationValue === "1") {
      $scope.currentPageSent = 1;
    } else if (paginationValue === "more") {
      $scope.currentPageSent = $scope.currentPageSent + 1;
    } else if (paginationValue === "less") {
      $scope.currentPageSent = $scope.currentPageSent - 1;
      if ($scope.currentPageSent <= 1) {
        $scope.currentPageSent = 1
      }
    }

    meterMessage.updateMessageSent($routeParams.serial, $scope.pageSizeSent, $scope.currentPageSent)
      .then(meterMessageSentUpdate)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function updateMeterAndMessages(showAlert) {
    individualMeter.update($routeParams.serial)
      .then(individualMeterUpdate)
      .catch(displayErrorMessage)
      .finally(endLoading(showAlert));

    meterMessage.updateMessageSent($routeParams.serial)
      .then(meterMessageSentUpdate)
      .catch(displayErrorMessage)
      .finally(endLoading);

    meterMessage.updateMessage($routeParams.serial)
      .then(meterMessageUpdate)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }
}
