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
    $scope.checked = false;

    function reqListener () {
      $scope.parse(this.responseText);
    }

    function initialize() {
      var mapOptions = {center: {lat: 40.1451, lng: -99.6680 }, zoom: 4, disableDefaultUI: true};
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

      google.maps.event.addListener($scope.map, 'click', function() {
        $scope.checked = false;

        $scope.$apply();
      });

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
      $scope.selectStation(parseInt(this.title));

      $scope.$apply();
    }

    var prevInfo = null;
    var prevMarker = null;

    $scope.selectStation = function(id) {
      if(prevInfo !== null) {
        prevMarker.setAnimation(null);
        prevInfo.close();
      }

      var station = $scope.stations[id];

      $scope.station_detail = station;

      $scope.map.panTo($scope.markers[id].position);
      $scope.map.setZoom(17);
      $scope.markers[id].setAnimation(google.maps.Animation.BOUNCE);

      var content = "<button onclick='alert(\"I am an alert\")'>hi</button>";

      var infowindow = new google.maps.InfoWindow({
          content: content
        });

      infowindow.open($scope.map, $scope.markers[id]);

      prevInfo = infowindow;
      prevMarker = $scope.markers[id];
      $scope.checked = true;
    }

    $scope.showAlert = function() {
      alert("I am an alert");
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
          //$scope.markers[id].setMap($scope.map);
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
            //$scope.markers[id].setMap(null);
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
