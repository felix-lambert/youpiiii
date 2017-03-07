angular.module('citytaps').controller('transactionHistoryCtrl', transactionHistoryCtrl);

transactionHistoryCtrl.$inject = ['individualAccount', '$routeParams', '$scope', '$rootScope', '$location', '$translate'];

function transactionHistoryCtrl(individualAccount, $routeParams, $scope, $rootScope, $location, $translate) {

  $scope.paginationPositiveTransactions = paginationPositiveTransactions;
  $scope.paginationConsumption          = paginationConsumption;
  $scope.paginationNegativeTransactions = paginationNegativeTransactions;
  $scope.currentPage                    = 1;
  $scope.currentPageConsumption         = 1;
  $scope.currentNegativePage            = 1;
  $scope.paginationCurrentConsumption   = 1;
  $scope.paginationCurrent              = 1;
  $scope.paginationCurrentNegative      = 1;
  $scope.pageSize                       = 50;
  $scope.pageSizeConsumption            = 50;
  $scope.pageSizeNegative               = 50;
  $rootScope.noRefresh                  = true;
  $rootScope.page                       = 'updateTransactions';
  $scope.preventSecondPage              = true;
  $scope.initSecondPage                 = initSecondPage;

  $scope.$on('update-transactions', function(event) {
    updateTransactions();
    alertify.success($translate.instant('PAGE_UPDATED'));
  });

  updateTransactions();

  function initSecondPage() {
    $scope.preventSecondPage = false;
  }

  function endLoading() {
  }

  function negativeTransactionUpdates(updatedNegativeTransactions) {
    $rootScope.lastTimeRefresh = Date.now();
    for (var i = 0; i < updatedNegativeTransactions.length; i++) {
      if (updatedNegativeTransactions[i].current_credit) {
        updatedNegativeTransactions[i].current_credit = Math.floor(updatedNegativeTransactions[i].current_credit);
      }
    }
    $scope.paginationCurrentNegative = $scope.currentNegativePage;
    $scope.negativeTransactions      = updatedNegativeTransactions;
  }

  function transactionUpdates(updatedTransactions) {
    $rootScope.lastTimeRefresh = Date.now();
    for (var i = 0; i < updatedTransactions.length; i++) {
      if (updatedTransactions[i].current_credit) {
        updatedTransactions[i].current_credit = Math.floor(updatedTransactions[i].current_credit);
      }
    }
    $scope.paginationCurrent = $scope.currentPage;
    $scope.transactions      = updatedTransactions;
  }

  function consumptionUpdates(updatedConsumptions) {
    $rootScope.lastTimeRefresh = Date.now();
    $scope.paginationCurrentConsumption = $scope.currentPageConsumption;
    $scope.consumptions                 = updatedConsumptions;
  }

  $(function() {
    $('#receive-form-link').click(function(e) {
      $("#receive-form").delay(100).fadeIn(100);
      $("#receive-negative").fadeOut(100);
      $('#receive-negative-link').removeClass('active');
      $("#send-form").fadeOut(100);
      $('#send-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });
    $('#receive-negative-link').click(function(e) {
      $("#receive-negative").delay(100).fadeIn(100);
      $("#receive-form").fadeOut(100);
      $('#receive-form-link').removeClass('active');
      $("#send-form").fadeOut(100);
      $('#send-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });
    $('#send-form-link').click(function(e) {
      $("#send-form").delay(100).fadeIn(100);
      $("#receive-negative").fadeOut(100);
      $('#receive-negative-link').removeClass('active');
      $("#receive-form").fadeOut(100);
      $('#receive-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });

  });

  function displayErrorMessage(error, status) {
    $scope.paginationCurrent      = 1;
    $scope.currentPage            = 1;
    $scope.currentPageConsumption = 1;
    $scope.currentNegativePage    = 1;
    $scope.errorMessage           = 'An error occured: please reload the page!';
    if (error.message === "invalidToken") {
      $location.path('/login');
    }
  }

  function paginationConsumption(paginationValue) {
    if (paginationValue === "1") {
      $scope.currentPageConsumption = 1;
    } else if (paginationValue === "more") {
      $scope.currentPageConsumption = $scope.currentPageConsumption + 1;
    } else if (paginationValue === "less") {
      $scope.currentPageConsumption = $scope.currentPageConsumption - 1;
      if ($scope.currentPageConsumption <= 1) {
        $scope.currentPageConsumption = 1
      }
    }

    individualAccount.getConsumptions($routeParams.id, $scope.pageSizeConsumption, $scope.currentPageConsumption)
      .then(consumptionUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function paginationPositiveTransactions(paginationValue) {
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
    individualAccount.getPositiveTransactions($routeParams.id, $scope.pageSize, $scope.currentPage)
      .then(transactionUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function paginationNegativeTransactions(paginationValue) {
    if (paginationValue === "1") {
      $scope.currentNegativePage = 1;
    } else if (paginationValue === "more") {
      $scope.currentNegativePage = $scope.currentNegativePage + 1;
    } else if (paginationValue === "less") {
      $scope.currentNegativePage = $scope.currentNegativePage - 1;
      if ($scope.currentNegativePage <= 1) {
        $scope.currentNegativePage = 1
      }
    }
    individualAccount.getNegativeTransactions($routeParams.id, $scope.pageSizeNegative, $scope.currentNegativePage)
      .then(negativeTransactionUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }

  function updateTransactions() {
    individualAccount.getPositiveTransactions($routeParams.id, 50, 1)
      .then(transactionUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading);

    individualAccount.getNegativeTransactions($routeParams.id, 50, 1)
      .then(negativeTransactionUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading);

    individualAccount.getConsumptions($routeParams.id, 50, 1)
      .then(consumptionUpdates)
      .catch(displayErrorMessage)
      .finally(endLoading);
  }
}