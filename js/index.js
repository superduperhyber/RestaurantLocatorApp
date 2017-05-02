var map;
var marker;
var mapsMarker = [];
var infoWindow;

function initMap() {
	var centerLoc = {lat: 10.314707, lng: 123.886189};
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 12,
	  center: centerLoc
	});
	var infoWindow = new google.maps.InfoWindow({map: map});

	navigator.geolocation.watchPosition(function(position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('This is your location.');
        map.setCenter(pos);

        var scope = new google.maps.Circle({
		    center: infoWindow.getPosition(),
		    radius: 5000,
		    strokeColor: "#00FF80",
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    fillColor: "#E6FFE6",
		    fillOpacity: 0.4
		  });
		  scope.setMap(map);

        marker = new google.maps.Marker({
		  position: pos,
		  map: map,
		});
      });

	putMarkers();
}

function test(){
	var selectedRating = document.getElementById('rating').value;
	//alert(document.getElementById('rating').value);
	for(var i=0;i<mapsMarker.length;i++){
		var mrkr = mapsMarker[i];

		if(selectedRating == "All"){
			mrkr.setVisible(true);
		}else{
			if(mrkr.rating == selectedRating){
				mrkr.setVisible(true);
			}else{
				mrkr.setVisible(false);
			}
		}
	}
}

function putMarkers(){
	$.getJSON("json/index.json",function(retrnValue){
		console.log(retrnValue);
		$.each(retrnValue, function(i, field){
          var foodspecialty = field.foodspecialty;
          var latitude = field.latitude;
          var longitude = field.longitude;
          var restaurantname = field.restaurantname;
          var restauranttype = field.restauranttype;
          var rating = field.rating;
          var logo = field.logo;
          var reviewee = field.reviews[0].reviewee;
          var message = field.reviews[0].message;

            var iconMarker = new google.maps.Marker({
	          position: {lat: latitude, lng: longitude},
	          map: map,
	          icon: "img/flag.png",
	          rating: rating
	        });

            mapsMarker.push(iconMarker);

            var contents  =  '<div id="content">'+
      '<div id="siteNotice" style="float:right;">'+
      '<button class="btn btn-primary btn-xs" style="border-radius:10%;" onclick="direction('+latitude+','+longitude+')">Direction</button><br/><br/>' +
      '</div>'+
      '<img src="'+logo+'" style="align:center;height:100px;width:100px;">'+restaurantname+'' +
      '<div id="bodyContent">&emsp;&emsp;<h4>Restaurant Info</h4>'+
		    '<ul class="list-group">'+
			  '<li class="list-group-item">'+
			    '<span class="badge">'+foodspecialty+'</span>'+
			    'Food Specialty : '+
			  '</li>'+
			  '<li class="list-group-item">'+
			    '<span class="badge">'+restauranttype+'</span>'+
			    'Restaurant Type : '+
			  '</li>'+
			  '<li class="list-group-item">'+
			    '<span class="badge">'+rating+' Stars</span>'+
			    'Rating : '+
			  '</li>'+
			'</ul>'+
      '<h5>Reviews</h5>'+
		  '<h5>'+message+'</h5>' +
		  '<h6>-'+reviewee+'</h6>' +
      '</div>'+
      '</div>';

	        var infowindow = new google.maps.InfoWindow({
	          content:contents
	        });
	        google.maps.event.addListener(iconMarker, 'click', function() {
            	infowindow.open(map,iconMarker);
        	});
        });
	});
}

function calculateAndDisplayRoute(directionsService, directionsDisplay,latitude,longitude) {
	var orgn = marker.getPosition();
	var dest = new google.maps.LatLng(latitude, longitude);
	directionsService.route({
	  origin: orgn,
	  destination: dest,
	  travelMode: 'DRIVING'
	}, function(response, status) {
	  if (status === 'OK') {
	    directionsDisplay.setDirections(response);
	  } else {
	    window.alert('Directions request failed due to ' + status);
	  }
	});
}
function direction(latitude,longitude){
    var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;

	if (directionsDisplay.getMap()) {
        directionsDisplay.setMap(null);
    }

    directionsDisplay.setMap(map);
	calculateAndDisplayRoute(directionsService, directionsDisplay,latitude,longitude);
}
