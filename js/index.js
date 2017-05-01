var map;
var directionsService;
var directionsDisplay;
var marker;

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
		    center: pos,
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

            var marker = new google.maps.Marker({
	          position: {lat: latitude, lng: longitude},
	          map: map,
	          icon: "img/flag.png"
	        });

            var contents  =  '<div id="content">'+
      '<div id="siteNotice">'+
      '<button class="btn btn-primary" style="border-radius:10%;" onclick="direction('+latitude+','+longitude+')">Direction</button><br/><br/>' +
      '</div>'+
      '<img src="'+logo+'" style="align:center;height:300px;width:300px;">' +
      '<h1 id="firstHeading" class="firstHeading">'+restaurantname+'</h1>'+
      '<div id="bodyContent">'+
      '<div class="panel panel-success">'+
		  '<div class="panel-heading">'+
		    '<h3 class="panel-title">Restaurant Info</h3>'+
		  '</div>'+
		  '<div class="panel-body">'+
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
		  '</div>'+
		'</div>'+
      '<h3>Reviews</h3>'+
      '<br/>'+
       '<blockquote>' +
		  '<h5>'+message+'</h5>' +
		  '<small><cite title="Source Title">'+reviewee+'</cite></small>' +
		'</blockquote>' +
      '</div>'+
      '</div>';

	        var infowindow = new google.maps.InfoWindow({
	          content:contents
	        });
	        google.maps.event.addListener(marker, 'click', function() {
            	infowindow.open(map,marker);
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
	//alert(latitude);
	//console.log(longitude);
    //directionDisplay.setMap(null);
    directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer;

    directionsDisplay.setMap(map);
	calculateAndDisplayRoute(directionsService, directionsDisplay,latitude,longitude);
}
