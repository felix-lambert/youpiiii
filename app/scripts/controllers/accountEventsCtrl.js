angular.module('citytaps').controller('accountEventsCtrl', accountEventsCtrl);

accountEventsCtrl.$inject = ['AclService', 'accountEvents', '$scope', '$rootScope', '$location', '$translate'];

function accountEventsCtrl(AclService, accountEvents, $scope, $rootScope, $location, $translate) {

  $rootScope.page     = 'accountEvents';
  $scope.can          = AclService.can;
  $scope.pagination   = pagination;
  $scope.currentPage  = 1;
  $scope.pageSize     = 50;
  $scope.pageSizeSent = 50;

  var dontShowToast = true;
  updateAccountEvents(dontShowToast);
  var accountEventsCacheName = 'accountEventsCache';
  $scope.showDetails         = function(id) {
    $location.path('/accounts/' + id);
  };

  $scope.hoveredCol  = null;
  $scope.hoveredRow  = null;
  $scope.mouseOverTd = function(row) {
    $scope.hoveredRow = row;
  };

  if (sessionStorage.getItem(accountEventsCacheName)) {
    $scope.accountEvents = JSON.parse(sessionStorage.getItem(accountEventsCacheName));
  }
  // test()
  function displayErrorMessage(error, status) {
    $scope.errorMessage = 'An error occured: please reload the page!';
    if (error.message === "invalidToken") {
      $location.path('/login');
    }
  }

  function endLoading(show) {
    if (!show) {
      alertify.success($translate.instant('PAGE_UPDATED'));
    }
  }

  function newAccountEvents(accountEventsResults) {
    $rootScope.lastTimeRefresh = Date.now();
    $scope.accountEvents       = accountEventsResults;
    sessionStorage.setItem(accountEventsCacheName, JSON.stringify(accountEventsResults));
    sessionStorage.setItem(accountEventsCacheName + 'timestamp', Date.now());
  }

  $scope.$on('update-accountEvents', function(event, args) {
    updateAccountEvents();
  });

  function updateAccountEvents(dontShowToast, page) {
    if (!AclService.can('account_events_details')) {
      $location.path('/');
    }
    accountEvents.update(page).then(newAccountEvents)
      .catch(displayErrorMessage)
      .finally(endLoading(dontShowToast));
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
    updateAccountEvents(true, $scope.currentPage);
  }

}