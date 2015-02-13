/**
 * Created by Megagirl on 2/12/15.
 */
angular.module('myApplicationModule', ['uiGmapgoogle-maps'])
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      //key: 'AIzaSyBZ9tilsR9M7eN4cx1FWPDAlunq7SRC6mw',
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
      $scope.title = "Smartrac Client"
      $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4, bounds: {}};
      $scope.ps =
        [{
          id: 1,
          path: [
            {
              latitude: 45,
              longitude: -74
            },
            {
              latitude: 30,
              longitude: -89
            },
            {
              latitude: 37,
              longitude: -122
            },
            {
              latitude: 60,
              longitude: -95
            }
          ],
          stroke: {
            color: '#6060FB',
            weight: 3
          },
          editable: true,
          draggable: true,
          geodesic: true,
          visible: true,
          icons: [{
            icon: {
              path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
            },
            offset: '25px',
            repeat: '50px'
          }]
        },
        {
          id: 2,
          path: [
            {
              latitude: 47,
              longitude: -74
            },
            {
              latitude: 32,
              longitude: -89
            },
            {
              latitude: 39,
              longitude: -122
            },
            {
              latitude: 62,
              longitude: -95
            }
          ],
          stroke: {
            color: '#6060FB',
            weight: 3
          },
          editable: true,
          draggable: true,
          geodesic: true,
          visible: true,
          icons: [{
            icon: {
              path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
            },
            offset: '25px',
            repeat: '50px'
          }]
        }];
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
