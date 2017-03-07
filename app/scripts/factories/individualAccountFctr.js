angular.module('citytaps').factory('individualAccount', individualAccount);

individualAccount.$inject = ['$q', '$http', 'apiURL'];

function individualAccount($q, $http, apiURL) {

  function config() {
    return {headers: {'Authorization': localStorage.getItem('token')}}
  }

  var meterObj = {
    update: update,
    saveAccount: saveAccount,
    destroy: destroy,
    addCredit: addCredit,
    getPositiveTransactions: getPositiveTransactions,
    getNegativeTransactions: getNegativeTransactions,
    getConsumptions: getConsumptions,
    getAttachedPhoneNumbers: getAttachedPhoneNumbers,
    deleteAttachedPhoneNumber: deleteAttachedPhoneNumber,
    addAttachedPhoneNumber: addAttachedPhoneNumber,
    resetCycles: resetCycles
  };

  return meterObj;

  function destroy(id) {
    var deferred = $q.defer();
    $http.delete(apiURL + '/v1/accounts/' + id, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function resetCycles(id) {
    var deferred = $q.defer();
    $http.post(apiURL + '/v1/accounts/resetCycles', {accountId: id}, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function deleteAttachedPhoneNumber(account_id, attachedPhoneNumberId) {
    var deferred = $q.defer();
    $http.delete(apiURL + '/v1/accounts/' + account_id + '/phoneNumber/' + attachedPhoneNumberId, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function update(id) {
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/accounts/' + id, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function getAttachedPhoneNumbers(id) {
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/accounts/' + id + '/phoneNumber/', config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function saveAccount(id, json) {
    var deferred = $q.defer();
    $http.patch(apiURL + '/v1/accounts/' + id, json, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function addCredit(id, creditToAdd) {
    var deferred = $q.defer();
    $http.post(apiURL + '/v1/accounts/' + id + '/addCredit', {creditToAdd: creditToAdd}, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function addAttachedPhoneNumber(id, attachedPhoneNumberToAdd) {
    var deferred = $q.defer();
    $http.post(apiURL + '/v1/accounts/' + id + '/phoneNumber', {phone_number: attachedPhoneNumberToAdd}, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function getPositiveTransactions(id, pageSize, page) {
    var deferred = $q.defer();
    if (!pageSize) {
      pageSize = 50;
    }
    if (!page) {
      page = 1;
    }
    $http.get(apiURL + '/v1/accounts/' + id + '/credit/' + pageSize + '/' + page, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function getNegativeTransactions(id, pageSize, page) {
    var deferred = $q.defer();
    if (!pageSize) {
      pageSize = 50;
    }
    if (!page) {
      page = 1;
    }
    $http.get(apiURL + '/v1/accounts/' + id + '/debit/' + pageSize + '/' + page, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function getConsumptions(id, pageSize, page) {
    var deferred = $q.defer();
    if (!pageSize) {
      pageSize = 50;
    }
    if (!page) {
      page = 1;
    }
    $http.get(apiURL + '/v1/accounts/consumptions/' + id + '/' + pageSize + '/' + page, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }
};

