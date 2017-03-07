angular.module('citytaps').controller('individualUserCtrl', individualUserCtrl);

individualUserCtrl.$inject = ['$scope', '$routeParams', 'individualUser', '$http', 'apiURL', '$location', '$rootScope', 'AclService'];

function individualUserCtrl($scope, $routeParams, individualUser, $http, apiURL, $location, $rootScope, AclService) {
  $rootScope.page = 'user';

  $scope.alert             = false;
  $scope.saveUser          = saveUser;
  $scope.json              = {};
  $scope.deleteUser        = deleteUser;
  $scope.showPasswordModal = showPasswordModal;
  $scope.hidePasswordModal = hidePasswordModal;
  $scope.showApiTokenModal = showApiTokenModal;
  $scope.hideApiTokenModal = hideApiTokenModal;
  $scope.submitPassword    = submitPassword;
  $scope.submitUserId      = submitUserId;
  $scope.can               = AclService.can;

  updateUser();

  $scope.$on('update-user', function(event, args) {
    updateUser();
    alertify.success($translate.instant('PAGE_UPDATED'));
  });

  function individualUserUpdate(updatedUser) {
    $rootScope.lastTimeRefresh = Date.now();
    $scope.json                    = updatedUser;
    $scope.buttonShowPasswordModal = true;
    $scope.buttonShowApiTokenModal = true;
  }

  function individualUserSave(userSaved) {
    $rootScope.lastTimeRefresh = Date.now();
  }

  function individualUserDestroy(userDestroy) {
    $rootScope.lastTimeRefresh = Date.now();
    $scope.buttonShowPasswordModal = true;
    $scope.buttonShowApiTokenModal = true;
    $rootScope.userDeleted         = true;
    $rootScope.userSaved           = false;
    $location.path('/users');
  }

  function displayErrorMessage(error, status) {
    $scope.errorMessage = 'An error occured: please reload the page!';
    if (error.message === "invalidToken") {
      $location.path('/login');
    }
  }

  function endLoading() {
  }

  function updateUser() {
    individualUser.update($routeParams.id)
      .then(individualUserUpdate)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function saveUser() {
    individualUser.edit($routeParams.id, $scope.json)
      .then(individualUserSave)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function deleteUser() {
    individualUser.destroy($routeParams.id)
      .then(individualUserDestroy)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function showPasswordModal() {
    $scope.passwordModal           = true;
    $scope.buttonShowPasswordModal = false;
    $scope.changePasswordSuccess   = false;
    $scope.changePasswordFail      = false;
  }

  function hidePasswordModal() {
    $scope.passwordModal           = false;
    $scope.buttonShowPasswordModal = true;
    $scope.changePasswordSuccess   = false;
    $scope.changePasswordFail      = false;
  }

  function showApiTokenModal() {
    $scope.changeApiTokenSuccess = false;
    $scope.changeApiTokenFail    = false;
  }


  function hideApiTokenModal() {
    $scope.apiTokenModal           = false;
    $scope.buttonShowApiTokenModal = true;
    $scope.changeApiTokenSuccess   = false;
    $scope.changeApiTokenFail      = false;
  }

  function passwordSubmitted(submittedPw) {
    $rootScope.lastTimeRefresh = Date.now();
    $scope.passwordModal           = false;
    $scope.buttonShowPasswordModal = true;
    if (submittedPw.message === "success") {
      $scope.changePasswordFail    = false;
      $scope.changePasswordSuccess = true;
    }
    else {
      $scope.changePasswordSuccess = false;
      $scope.changePasswordFail    = true;
    }
  }

  function client_idSubmitted(submittedClient_id) {
    $scope.apiTokenModal           = false;
    $scope.buttonShowApiTokenModal = true;
    if (submittedClient_id.message === "success") {
      $scope.token                 = submittedClient_id.token;
      $scope.changeApiTokenFail    = false;
      $scope.changeApiTokenSuccess = true;
    } else {
      $scope.changeApiTokenSuccess = false;
      $scope.changeApiTokenFail    = true;
    }
  }

  function submitFailErrorMessage() {
    $scope.changePasswordFail = true;
  }

  function submitPassword() {
    individualUser.changePwd($routeParams.id, $scope.newPassword)
      .then(passwordSubmitted)
      .catch(submitFailErrorMessage)
      .finally(endLoading);
  }

  function submitUserId() {
    individualUser.getClientServerToken($routeParams.id, $scope.user_id)
      .then(client_idSubmitted)
      .catch(submitFailErrorMessage)
      .finally(endLoading);
  }

  $scope.permissions = [
    {role: 'SuperAdmin'},
    {role: 'Admin'},
    {role: 'CustomerManager'},
    {role: 'Reader'},
    {role: 'SMS_server'},
    {role: 'MQTT_listener'}
  ];
}