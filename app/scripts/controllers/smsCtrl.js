angular.module('citytaps').controller('smsCtrl', smsCtrl);

smsCtrl.$inject = ['$scope', 'sms', '$rootScope', '$location', '$translate'];

function smsCtrl($scope, sms, $rootScope, $location, $translate) {

  $scope.pagination               = pagination;
  $scope.paginationSmsSent        = paginationSmsSent;
  $scope.paginationCurrent        = 1;
  $scope.paginationCurrentSmsSent = 1;

  $scope.pageSize        = 50;
  $scope.pageSizeSmsSent = 50;

  $scope.currentPageSmsSent = 1;
  $scope.currentPage        = 1;
  $rootScope.page           = 'sms';
  var smsCacheName          = 'smsCache';
  var smsSentCacheName      = 'smsSentCache';

  if (sessionStorage.getItem(smsCacheName)) {
    $scope.sms = JSON.parse(sessionStorage.getItem(smsCacheName));
  }

  if (sessionStorage.getItem(smsSentCacheName)) {
    $scope.smsSent = JSON.parse(sessionStorage.getItem(smsSentCacheName));
  }

  var dontShowToast = true;
  getSms(dontShowToast);

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

  function paginationSmsSent(paginationValue) {
    if (paginationValue === "1") {
      $scope.currentPageSmsSent = 1;
    } else if (paginationValue === "more") {
      $scope.currentPageSmsSent = $scope.currentPageSmsSent + 1;
    } else if (paginationValue === "less") {
      $scope.currentPageSmsSent = $scope.currentPageSmsSent - 1;
      if ($scope.currentPageSmsSent <= 1) {
        $scope.currentPageSmsSent = 1
      }
    }
    sms.updateSmsSent($scope.pageSizeSmsSent, $scope.currentPageSmsSent)
      .then(smsUpdatesSent)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  $scope.$on('update-sms', function(event) {
    getSms();
  });

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

    sms.update($scope.pageSize, $scope.currentPage)
      .then(smsUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function endLoading(show) {
    if (!show) {
      alertify.success($translate.instant('PAGE_UPDATED'));
    }
  }

  function smsUpdates(updatedSms) {
    $rootScope.lastTimeRefresh = Date.now();
    $scope.paginationCurrent = $scope.currentPage;
    $scope.sms               = updatedSms;
    sessionStorage.setItem(smsCacheName, JSON.stringify(updatedSms));
    sessionStorage.setItem(smsCacheName + 'timestamp', Date.now());
  }

  function smsUpdatesSent(updatedSms) {
    $rootScope.lastTimeRefresh = Date.now();
    $scope.paginationCurrentSmsSent = $scope.currentPageSmsSent;
    $scope.smsSent                  = updatedSms;
    sessionStorage.setItem(smsSentCacheName, JSON.stringify(updatedSms));
    sessionStorage.setItem(smsSentCacheName + 'timestamp', Date.now());
  }

  function displayErrorMessage(error, status) {
    $scope.paginationCurrent        = 1;
    $scope.paginationCurrentSmsSent = 1;
    $scope.currentPage              = 1;
    $scope.currentPageSmsSent       = 1;
    if (error.message === "invalidToken") {
      $location.path('/login');
    }
  }

  function getSms(dontShowToast) {
    sms.update(50, 1)
      .then(smsUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading(dontShowToast));

    sms.updateSmsSent(50, 1)
      .then(smsUpdatesSent)
      .catch(displayErrorMessage)
      .finally();
  }
}
