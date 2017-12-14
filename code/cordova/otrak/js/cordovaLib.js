
function setCameraOptions(srcType) {
  var options = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType: srcType,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true  //Corrects Android orientation quirks
  }
  return options;
}

function openFilePicker(selection) {
    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setCameraOptions(srcType);
//    var func = createNewFileEntry;
    navigator.camera.getPicture(function cameraSuccess(imageUri) {
      alert('imageUri='+ imageUri)
      displayImage(imageUri)
      // Do something
    }, function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    }, options);
}

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // this.receivedEvent('deviceready');
        navigator.geolocation.getCurrentPosition(this.onLocateSuccess, this.onLocateError);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = one(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    onLocateSuccess: function(position) {
      // var longitude = position.coords.longitude
      // var latitude = position.coords.latitude
      var infoWindow = new google.maps.InfoWindow({map: gMap});
      myLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      infoWindow.setPosition(myLocation);
      infoWindow.setContent('你的位置');
      gMap.setCenter(myLocation)
//      initMap(longitude, latitude)
    },

    onLocateError: function(error) {
      alert("the code is " + error.code + ". \n" + "message: " + error.message);
//      initMap(longitude, latitude)
    }
};

app.initialize();