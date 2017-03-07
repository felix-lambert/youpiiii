angular.module('citytaps').controller('individualSmsCtrl', individualSmsCtrl);

individualSmsCtrl.$inject = ['$scope', 'sms', '$rootScope', '$routeParams', '$location', '$translate'];

function individualSmsCtrl($scope, sms, $rootScope, $routeParams, $location, $translate) {


  $scope.pagination               = pagination;
  $scope.paginationSmsSent        = paginationSmsSent;
  $scope.paginationCurrent        = 1;
  $scope.paginationCurrentSmsSent = 1;

  $scope.pageSize        = 50;
  $scope.pageSizeSmsSent = 50;

  $scope.currentPageSmsSent = 1;
  $scope.currentPage        = 1;
  $rootScope.page           = 'sms';

  getSmsById();

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
    sms.getByIdSent($routeParams.account_id, $scope.pageSize, $scope.currentPageSmsSent)
      .then(smsUpdatesSent)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  $scope.$on('update-sms', function(event) {
    getSmsById();
    alertify.success($translate.instant('PAGE_UPDATED'));
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

    sms.getById($routeParams.account_id, $scope.pageSize, $scope.currentPage)
      .then(smsUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function endLoading() {
  }

  function smsUpdates(updatedSms) {
    $rootScope.lastTimeRefresh = Date.now();
    $scope.paginationCurrent = $scope.currentPage;
    $scope.sms               = updatedSms;
  }

  function smsUpdatesSent(updatedSms) {
    $rootScope.lastTimeRefresh = Date.now();
    $scope.paginationCurrentSmsSent = $scope.currentPageSmsSent;
    $scope.smsSent                  = updatedSms;
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

  function getSmsById() {
    sms.getById($routeParams.account_id, $scope.pageSize, $scope.currentPage)
      .then(smsUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading);

    sms.getByIdSent($routeParams.account_id, $scope.pageSize, $scope.currentPage)
      .then(smsUpdatesSent)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

}
