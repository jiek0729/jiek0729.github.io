/**
 * Created by Megagirl on 2/12/15.
 */
angular.module('myApplicationModule', ['uiGmapgoogle-maps', 'ngGPlaces'])
  .constant("filters", ['--select--','state', 'region', 'city'])
  .controller("someController", function($scope, filters) {
    $scope.title = "Stations";
    $scope.filters = filters;
    $scope.states = ['--select--'];
    $scope.regions = ['--select--'];
    $scope.cities = ['--select--'];
    $scope.filterValues = {'state': $scope.states, 'region': $scope.regions, 'city': $scope.cities};
    $scope.filterValue = ['--select--'];
    $scope.selectedFilter = '--select--';
    $scope.selectedFilterValue = '--select--';
    $scope.stationList = {};

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
      $scope.stationList = $scope.stations;

      for(var i in $scope.markers) {
        $scope.markers[i].setMap(null);
      }

      $scope.markers={};

      for (var id in $scope.stations) {
        var station = $scope.stations[id];
        if($scope.states.indexOf(station.state) == -1){
          $scope.states.push(station.state);
        }
        if($scope.regions.indexOf(station.region) == -1){
          $scope.regions.push(station.region);
        }
        if($scope.cities.indexOf(station.region) == -1){
          $scope.cities.push(station.region);
        }

        var marker = new google.maps.Marker({
          position: station.coords,
          map: $scope.map,
          title: id
        });

        google.maps.event.addListener(marker, 'click', $scope.markerHandler);

        $scope.markers[id] = marker;
      }

      $scope.$apply();
    }

    $scope.markerHandler = function(){
      var station = $scope.stations[parseInt(this.title)];

      var content = "";
      for (var property in station) {
        content += property + ": " + station[property] + "<br/>";
      }

      var infowindow = new google.maps.InfoWindow({
        content: content
        //content: JSON.stringify(station, null, 2)
      });

      //infowindow.open($scope.map);
      //window.console.log(this);
      $scope.selectedStationName = station.station_name;
    }

    $scope.selectStation = function(id) {
      var station = $scope.stations[id];

      $scope.map.setZoom(17);
      $scope.map.panTo($scope.markers[id].position);
    }

    $scope.filterChange = function() {
      if($scope.selectedFilter === '--select--') {
        $scope.filterValue = ['--select--'];
      } else {
        $scope.filterValue = $scope.filterValues[$scope.selectedFilter];
      }

      if($scope.selectedFilterValue !== '--select--') {
        $scope.selectedFilterValue = '--select--';
        $scope.filter();
      }
    }

    $scope.filter = function() {
      var bounds = new google.maps.LatLngBounds();

      if($scope.selectedFilterValue === '--select--'){
        $scope.stationList = $scope.stations;

        for (var id in $scope.markers) {
          $scope.markers[id].setMap($scope.map);
          bounds.extend($scope.markers[id].position);
        }

        //$scope.map.setZoom(4);
        //$scope.map.setCenter({lat: 40.1451, lng: -99.6680 });
      } else {
        $scope.stationList = {};
        for (var id in $scope.stations) {
          var station = $scope.stations[id];
          if(station[$scope.selectedFilter] == $scope.selectedFilterValue) {
            $scope.stationList[id] = station;
            $scope.markers[id].setMap($scope.map);
            bounds.extend($scope.markers[id].position);
          } else {
            $scope.markers[id].setMap(null);
          }
        }
      }

      $scope.map.fitBounds(bounds);
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
