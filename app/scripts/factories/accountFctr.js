angular.module('citytaps').factory('account', account);

account.$inject = ['$q', '$http', 'apiURL'];

function account($q, $http, apiURL) {

  function config() {
    return {headers: {'Authorization': localStorage.getItem('token')}}
  }

  var accountObj = {
    update: update,
    save: save,
    enablePayment: enablePayment,
    updateDasboard: updateDasboard
  };

  return accountObj;
 
  function updateDasboard() {
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/accounts/dashboards', config())
    .success(deferred.resolve)
    .error(deferred.reject);
    return deferred.promise;
  }

  function update() {
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/accounts/', config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function save(json) {
    var deferred = $q.defer();
    $http.post(apiURL + '/v1/accounts/', json, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function enablePayment(id, payment) {
    var deferred = $q.defer();
    $http.post(apiURL + '/v1/accounts/' + id + '/enablePayment', payment, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

};

