angular.module('citytaps').factory('accountEvents', accountEvents);

accountEvents.$inject = ['$http', 'apiURL', '$q'];

function accountEvents($http, apiURL, $q) {

  function config() {
    return {headers: {'Authorization': localStorage.getItem('token')}}
  }

  var accountEventsObj = {
    update: update,
    login: login
  };

  return accountEventsObj;

  function update(page) {
    if (!page) {
      page = 1;
    }
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/accounts/events/50/' + page, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function login(accountEvents) {
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
      data: accountEvents
    }).success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;

  }
}
