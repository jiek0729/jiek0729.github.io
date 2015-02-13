/**
 * Created by Megagirl on 2/12/15.
 */
angular.module('myApplicationModule', ['uiGmapgoogle-maps'])
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyBZ9tilsR9M7eN4cx1FWPDAlunq7SRC6mw',
      v: '3.17',
      libraries: 'weather,geometry,visualization'
    });
  })
  .controller("someController", function($scope, uiGmapGoogleMapApi) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
      $scope.title = "Hello Google Map"
      $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
      //$scope.options = {scrollwheel: false};
    });

    $scope.showContent = function($fileContent){
      $scope.content = $fileContent;
    };
  })
  .directive('onReadFile', function ($parse) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
        var fn = $parse(attrs.onReadFile);

        element.on('change', function(onChangeEvent) {
          var reader = new FileReader();

          reader.onload = function(onLoadEvent) {
            scope.$apply(function() {
              fn(scope, {$fileContent:onLoadEvent.target.result});
            });
          };

          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });
      }
    };
  })
  .controller('MainCtrl', function ($scope) {
    $scope.showContent = function($fileContent){
      $scope.content = $fileContent;
    };
  })
  .directive('onReadFile', function ($parse) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, element, attrs) {
      var fn = $parse(attrs.onReadFile);

      element.on('change', function(onChangeEvent) {
        var reader = new FileReader();

        reader.onload = function(onLoadEvent) {
          scope.$apply(function() {
            fn(scope, {$fileContent:onLoadEvent.target.result});
          });
        };

        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
      });
    }
  };
});
