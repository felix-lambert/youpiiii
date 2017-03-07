angular.module('citytaps').factory('sms', sms);

sms.$inject = ['$q', '$http', 'apiURL'];

function sms($q, $http, apiURL) {

  function config() {
    return {headers: {'Authorization': localStorage.getItem('token')}}
  }

  var meterObj = {
    update: update,
    getById: getById,
    getByIdSent: getByIdSent,
    updateSmsSent: updateSmsSent
  };

  return meterObj;

  function update(pageSize, page) {
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/sms/' + pageSize + '/' + page + '/getSms/', config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function updateSmsSent(pageSize, page) {
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/sms/' + pageSize + '/' + page + '/getSmsSent/', config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function getById(id, pageSize, page) {
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/accounts/' + id + '/' + pageSize + '/' + page + '/getSms/', config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function getByIdSent(id, pageSize, page) {
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/accounts/' + id + '/' + pageSize + '/' + page + '/getSmsSent/', config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }
};
