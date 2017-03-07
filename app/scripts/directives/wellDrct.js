angular.module('citytaps').directive('ngWell', function () {
  return {
    scope: {
      value: '=',
      title: '=',
      name: '=',
      namePosition: '@namePosition'
    },
    templateUrl: '/templates/directives/well.tpl.html'
  };
});