angular.module('citytaps').factory('user', user);

user.$inject = ['$http', 'apiURL', '$q'];

function user($http, apiURL, $q) {
  
  function config() {
    return {headers: {'Authorization': localStorage.getItem('token')}}
  }  

  var userObj = {
    update: update,
    login: login
  };

  return userObj;

  function update() {
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/user/', config())
    .success(deferred.resolve)
    .error(deferred.reject);
    return deferred.promise;
  }

  function login(user) {
    var deferred = $q.defer();
    $http({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: apiURL + '/login',
      transformRequest: function(obj) {
        var str = [];
        for (var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      },
      data: user
    }).success(deferred.resolve)
    .error(deferred.reject);
    return deferred.promise;

  }
}
