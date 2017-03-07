angular.module('citytaps').directive('ngDayIndividualDisplay', function () {
  return {
    scope: {
      cash: '=',
      disconnect: '=',
      water: '=',
      disconnectTime: '='
    },
    templateUrl: '/templates/directives/daysIndividualDisplay.tpl.html'
  };
});