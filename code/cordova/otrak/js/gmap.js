var gmap = {}

gmap.locations = [
  {lat: 24.450606, lng: 118.330145},
  {lat: 24.350606, lng: 118.230145},
  {lat: 24.350606, lng: 118.330145},
  {lat: 24.550606, lng: 118.330145},
  {lat: 24.450606, lng: 118.330145},
  {lat: 24.450606, lng: 118.330145},
  {lat: 24.451606, lng: 118.330145},
  {lat: 24.452606, lng: 118.330145},
  {lat: 24.453606, lng: 118.330145},
  {lat: 24.454606, lng: 118.330145},
  {lat: 24.455606, lng: 118.330145},
  {lat: 24.450606, lng: 118.330145},
  {lat: 24.451606, lng: 118.330145},
  {lat: 24.452606, lng: 118.331145},
  {lat: 24.453606, lng: 118.332145},
  {lat: 24.454606, lng: 118.333145},
  {lat: 24.455606, lng: 118.334145},
]

gmap.init = function (element, lat=24.00, lng=118.00) { //  lat=24.45, lng=118.33
  this.myLocation = {lat:lat, lng:lng}
  this.map = new google.maps.Map(element, {
    zoom: 15,
    center: gmap.myLocation
  });
  // Create an array of alphabetical characters used to label the markers.
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  // Add some markers to the map.
  // Note: The code uses the JavaScript Array.prototype.map() method to
  // create an array of markers based on a given "locations" array.
  // The map() method here has nothing to do with the Google Maps API.
  var markers = this.locations.map(function(location, i) {
    return new google.maps.Marker({
        position: location,
        label: labels[i % labels.length]
    });
  });
  // Add a marker clusterer to manage the markers.
  var markerCluster = new MarkerClusterer(this.map, markers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

gmap.locate = function () {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    gmap.userMarker = new google.maps.Marker({
      position: pos,
      map: gmap.map,
      icon: 'img/person.png'
    });

//    var infoWindow = new google.maps.InfoWindow({map: gmap.map});
//    infoWindow.setPosition(pos);
//    infoWindow.setContent('你的位置');
    var infoWindow = new google.maps.InfoWindow({content: '你的位置'});
    gmap.userMarker.addListener('click', function() {
      infoWindow.open(gmap.map, gmap.userMarker);
    });
    gmap.map.setCenter(pos);
  }, function() {
    alert('locate error!')
    // handleLocationError(true, infoWindow, map.getCenter());
  });
}

function initMap() {
  gmap.init(document.getElementById('map'))
  gmap.locate()
}