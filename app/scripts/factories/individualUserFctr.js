angular.module('citytaps').factory('individualUser', individualUser);

individualUser.$inject = ['$q', '$http', 'apiURL'];

function individualUser($q, $http, apiURL) {

  function config() {
    return {headers: {'Authorization': localStorage.getItem('token')}}
  }

  var meterObj = {
    update: update,
    edit: edit,
    destroy: destroy,
    changePwd: changePwd,
    getClientServerToken: getClientServerToken,
    save: save
  };

  return meterObj;

  function changePwd(id, newPassword) {
    var deferred = $q.defer();
    $http.patch(apiURL + '/v1/user/' + id + '/updatePassword', {
      'newPassword': newPassword
    }, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function getClientServerToken(id, user_id) {
    var deferred = $q.defer();
    $http.post(apiURL + '/v1/user/' + id + '/generateClientServerToken', {
      'user_id': user_id
    }, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function destroy(id) {
    var deferred = $q.defer();
    $http.delete(apiURL + '/v1/user/' + id, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function edit(id, json) {
    var deferred = $q.defer();
    $http.patch(apiURL + '/v1/user/' + id, json, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function save(json) {
    var deferred = $q.defer();
    $http.post(apiURL + '/v1/user/', json, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function update(id) {
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/user/' + id, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }
};