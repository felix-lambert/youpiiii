angular.module('citytaps').controller('userCtrl', userCtrl);

userCtrl.$inject = ['AclService', 'user', '$scope', '$rootScope', '$location', '$translate'];

function userCtrl(AclService, user, $scope, $rootScope, $location, $translate) {

  $rootScope.page   = 'user';
  $scope.can        = AclService.can;
  var userCacheName = 'userCache';

  if (sessionStorage.getItem(userCacheName)) {
    $scope.users = JSON.parse(sessionStorage.getItem(userCacheName));
  }

  var dontShowToast = true;
  updateUsers(dontShowToast);

  $scope.showDetails = function(id) {
    $location.path('/users/' + id);
  };

  $scope.hoveredCol  = null;
  $scope.hoveredRow  = null;
  $scope.mouseOverTd = function(row) {
    $scope.hoveredRow = row;
  };

  if ($rootScope.userSaved) {
    alertify.success($translate.instant('PAGE_UPDATED'));
    alertify.error($translate.instant('ALERT.INDIVIDUAL_USER.REDIRECTION'));
    return;
  }

  if ($rootScope.userDeleted) {
    alertify.error($translate.instant('ALERT.INDIVIDUAL_USER.REDIRECTION'));
    alertify.error($translate.instant('ALERT.INDIVIDUAL_USER.DELETED'));
    return;
  }

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

  function userUpdates(userResults) {
    $rootScope.lastTimeRefresh = Date.now();
    $scope.users               = userResults;
    sessionStorage.setItem(userCacheName, JSON.stringify(userResults));
    sessionStorage.setItem(userCacheName + 'timestamp', Date.now());
  }

  $scope.$on('update-user', function(event, args) {
    updateUsers();
  });

  function updateUsers(dontShowToast) {
    if (!AclService.can('userPage')) {
      $location.path('/');
    }
    user.update()
      .then(userUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading(dontShowToast));
  }

}