angular.module('citytaps').factory('meterMessage', meterMessage);

meterMessage.$inject = ['$q', '$http', 'apiURL'];

function meterMessage($q, $http, apiURL) {

  function config() {
    return {headers: {'Authorization': localStorage.getItem('token')}}
  }

  var meterObj = {
    updateMessage: updateMessage,
    saveMessageToMeter: saveMessageToMeter,
    updateMessageSent: updateMessageSent
  };

  return meterObj;

  function saveMessageToMeter(typeOfMessage, payload, serial) {
    var deferred = $q.defer();
    $http.post(apiURL + '/v1/meters/' + serial + '/sendMessageToMeter', {
      'typeOfMessage': typeOfMessage,
      'payload': payload
    }, config()).success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  //probleme quand on update car json n'est pas définit car mauvais scope qu'on lui transfert
  function updateMessage(serial, pageSize, page) {
    if (!pageSize) {
      pageSize = 50;
    }
    if (!page) {
      page = 1;
    }
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/meters/' + serial + '/messages/' + pageSize + '/' + page, config())
      .success(deferred.resolve)
      .error(deferred.reject);
    return deferred.promise;
  }

  function updateMessageSent(serial, pageSizeSent, pageSent) {
    if (!pageSizeSent) {
      pageSizeSent = 50;
    }
    if (!pageSent) {
      pageSent = 1;
    }
    var deferred = $q.defer();
    $http.get(apiURL + '/v1/meters/' + serial + '/sentmessages/' + pageSizeSent + '/' + pageSent, config())
    .success(deferred.resolve)
    .error(deferred.reject);
    return deferred.promise;
  }
};