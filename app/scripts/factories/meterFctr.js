angular.module('citytaps').factory('meter', meter);

meter.$inject = ['$q', '$http', 'apiURL'];

function meter($q, $http, apiURL) {

  function config() {
    return {headers: {'Authorization': localStorage.getItem('token')}}
  }

  var meterObj = {
    update: update,
    save: save
  };

  return meterObj;

  //probleme quand on update car json n'est pas définit car mauvais scope qu'on lui transfert
  function update() {
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/meters/', config())
    .success(deferred.resolve)
    .error(deferred.reject);
    return deferred.promise;
  }

  function save(json) {
    var deferred = $q.defer();
    $http.post(apiURL + '/v1/meters/', json, config())
    .success(deferred.resolve)
    .error(deferred.reject);
    return deferred.promise;
  }
};

