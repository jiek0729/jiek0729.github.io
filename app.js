/**
 * Created by Megagirl on 2/12/15.
 */
angular.module('myApplicationModule', ['uiGmapgoogle-maps', 'ngGPlaces'])
  .controller("someController", function($scope) {
    $scope.title = "Stations";

    function reqListener () {
      $scope.parse(this.responseText);
    }

    function initialize() {
      var mapOptions = {center: {lat: 40.1451, lng: -99.6680 }, zoom: 4};
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

      var oReq = new XMLHttpRequest();
      oReq.onload = reqListener;
      oReq.open("get", "AllStations.csv", true);
      oReq.send();
    }
    google.maps.event.addDomListener(window, 'load', initialize);

    $scope.showContent = function($fileContent){
      $scope.content = $fileContent;
    };

    $scope.markers = [];

    $scope.showContent = function($fileContent){
      $scope.content = $fileContent;
    };

    $scope.parse = function(content) {
      content = content.replace(/(\r\n|\n|\r)/gm,"\n");

      $scope.stations = csvJSON(content);

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
