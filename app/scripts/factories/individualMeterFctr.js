angular.module('citytaps').factory('individualMeter', individualMeter);

individualMeter.$inject = ['$q', '$http', 'apiURL'];

function individualMeter($q, $http, apiURL) {

  function config() {
    return {headers: {'Authorization': localStorage.getItem('token')}}
  }

  var meterObj = {
    update: update,
    saveMeter: saveMeter,
    deleteMeter: deleteMeter,
    joinAccount: joinAccount
  };

  return meterObj;

  function deleteMeter(serial) {
    var deferred = $q.defer();
    $http.delete(apiURL + '/v1/meters/' + serial, config())
    .success(deferred.resolve)
    .error(deferred.reject);
    return deferred.promise;
  }

  function saveMeter(serial, individualMeter) {
    var deferred = $q.defer();
    $http.patch(apiURL + '/v1/meters/' + serial, individualMeter, config())
    .success(deferred.resolve)
    .error(deferred.reject);
    return deferred.promise;
  }

  //probleme quand on update car json n'est pas définit car mauvais scope qu'on lui transfert
  function update(serial) {
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/meters/' + serial, config())
    .success(deferred.resolve)
    .error(deferred.reject);
    return deferred.promise;
  }


  function joinAccount(meterAccount) {
    var deferred = $q.defer();
    $http.post(apiURL + '/v1/meters/joinAccount', meterAccount, config())
    .success(deferred.resolve)
    .error(deferred.reject);
    return deferred.promise;
  }
};
