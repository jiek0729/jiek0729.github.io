/**
 * Created by Megagirl on 2/12/15.
 */
angular.module('myApplicationModule', ['uiGmapgoogle-maps', 'ngGPlaces'])
  .constant("polylines", [{
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
    }])
  .controller("someController", function($scope) {
    function initialize() {
      var mapOptions = {center: {lat: 40.1451, lng: -99.6680 }, zoom: 4};
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    }
    google.maps.event.addDomListener(window, 'load', initialize);

    $scope.showContent = function($fileContent){
      $scope.content = $fileContent;
    };

    $scope.markers = []

    $scope.showContent = function($fileContent){
      $scope.content = $fileContent;
    };

    $scope.markerHandler = function(){
      id = parseInt(this.title);

      var station = $scope.stations[parseInt(this.title)];

      var content = "";
      for (var property in station) {
        content += "<hr/>" + property + ": " + station[property];
      }

      var infowindow = new google.maps.InfoWindow({
        content: content
        //content: JSON.stringify(station, null, 2)
      });

      infowindow.open($scope.map, this);
      //window.console.log(this);
    }

    $scope.parse = function() {

      $scope.stations = csvJSON($scope.content);

      for(i in $scope.markers) {
        $scope.markers[i].setMap(null);
      }

      $scope.markers=[];

      for (id in $scope.stations) {
        var marker = new google.maps.Marker({
          position: $scope.stations[id].coords,
          map: $scope.map,
          title: id
        });

        google.maps.event.addListener(marker, 'click', $scope.markerHandler);

        $scope.markers.push(marker);
      }
    }
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
