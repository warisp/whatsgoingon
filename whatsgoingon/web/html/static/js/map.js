var markers = [];
var events = ["undefined"];
var eventtitle;
var venuename;
var artistname;
var image;
var eventdate;
var eventtickets;
var spotifyResult;
var interested;
var socket;


function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#242f3e"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#746855"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#242f3e"
              }
            ]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#d59563"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#d59563"
              }
            ]
          },
          {
            "featureType": "poi.attraction",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.business",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "poi.government",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.medical",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#263c3f"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#6b9a76"
              }
            ]
          },
          {
            "featureType": "poi.place_of_worship",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#38414e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#212a37"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9ca5b3"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#746855"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#1f2835"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#f3d19c"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#2f3948"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#d59563"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#17263c"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#515c6d"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#17263c"
              }
            ]
          }
        ]
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

    //marker infoWindow initialiser
    var infowindow = new google.maps.InfoWindow({
        content: "",
        maxWidth: 1000
    });

    //Set default location to Geneva
    var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': "Geneva"}, function(results, status) {
        map.setCenter(results[0].geometry.location);
    });

    //Listener for mouse movement
    //Searches for events nearby in the future
    //Creates infoWindow with details returns by REST server (REST Server calls EventFul)
    map.addListener('idle', function (e) {

        var longitude = map.center.lng();
        var latitude = map.center.lat();


        //Rest call to get events from my rest server -> eventful:
        var url = 'api/events/'+latitude+'/'+longitude+'';
        $.ajax({
            method: "GET",
            dataType: "json",
            url: url,
            cache: true,
            timeout: 5000,
            async : true,
            success: function(data) {
                //console.log(data);
                for (i = 0; i < Object.keys(data).length; i++) {
                    addMarker(data[i]);
                }
            }
        });
    });

    //Array function to see if something exists in events[] already.
    function isInArray(array, string) {
        return array.indexOf(string) > -1;
    }

    function addMarker(json) {
        //Skip if event is already show; otherwise put marker.
        if (isInArray(events, json.venue_name)) {
            console.log('Duplicate, skipping...');
        } else {
            //If we get a valid response then we add a marker.
            if (json && json.performers && json.performers.performer) {
                //Initialise marker and set at lng/lat returned by eventful:
                var marker = new google.maps.Marker({
                    position: {lat: Number(json.latitude), lng: Number(json.longitude)},
                    map: map,
                    title: json.title
                });

                //Clustering of markers when zoomed out.
                markers.push(marker);

                //Add listener for when it's clicked. Shows info + calls spotify for track.
                marker.addListener('click', function() {
                    addInfoWindow(marker, json);
                });
            }
        }
    }

    function addInfoWindow(marker, json){//, rest_track_url) {

        infowindow.close();
        infowindow.setContent("");

        eventtitle = json.title;
        venuename = json.venue_name;
        eventdate = json.start_time;
        eventtickets = json.url;

        if (json.image == null){
            image = "https://www.raadyo.com/artist/img/artist.png"
        } else {
            image = json.image.medium.url;
        }

        var spArtist = json.performers.performer.name.replace(/\s/g, "+");
        var rest_track_url = 'http://localhost:5000/api/toptracks/'+spArtist+'';

        var rest_track_url = 'http://localhost:5000/api/toptracks/'+spArtist+'';

        $.ajax({
            method: "GET",
            dataType: "json",
            url: rest_track_url,
            cache: true,
            timeout: 2000,
            async : true,
            success: function(data) {
                //Display HTML content within infoWindow.
                infowindow.setContent(
                '<body>'+
                '<h1 align="center"><b align="center">' + eventtitle + '</b></h1>' +
                '<img class="eventimg" src="' + image + '" width="460" height="250">' +
                '<p>Date:<b> ' + eventdate + '</b></p>' +
                '<p>Venue:<b> ' + venuename + '</b></p>'+
                '<p>Interested: <b id="messages">Only you for the moment.</b></p>' +
                '<div align="center" id="player">'+
                    '<audio controls>' +
                        '<source src="' + data.preview_url + '" type="audio/mpeg">' +
                    '</audio>'+
                '</div>'+
                '<p>Artist:<b> ' + json.performers.performer.name + '</b></p>' +
                '<p>Track:<b> ' + data.name + '</b></p>' +
                '<p>Album:<b> ' + data.album.name + '</b></p> ' +
                '<p>Tickets:&nbsp;<a href="' + eventtickets + '">Link to tickets</a></p>' +
                '</body>'
                );
            },
        });

        infowindow.open(map, marker);
    }

}
