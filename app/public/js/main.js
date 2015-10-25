var sid = [];
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.411087, lng: -80.475802},
    zoom: 10
  });

dbtweets.forEach(function(entry){
	setMarkerTweet(entry);
});  
}

var setMarkerInsta = function(insta){
	//console.log("We in the setMarker method")
	var image = {
		url: 'images/insta_mark.png'
	}
	var iLatLng = new google.maps.LatLng(insta.latitude, insta.longitude);
    var marker = new google.maps.Marker({
		position: iLatLng,
		animation: google.maps.Animation.DROP,
		title: 'Hello World!',
		icon: image
	}); 
	var contentString = '<div id="content">'+
  		'<div id="siteNotice">'+
  		'</div>'+
  		'<h1 id="firstHeading" class="firstHeading">'+ insta.username +'</h1>'+
  		'<div id="bodyContent">'+
  		'<img src="'+ insta.profile_pic +'" alt="Smiley face" height="150" width="150">' +
  		'<p>'+ insta.text +'</p>'+
  		'<img src="'+ insta.image +'" alt="Smiley face" height="640" width="640">' +
  		'</div>'+
  		'</div>';

	  var infowindow = new google.maps.InfoWindow({
	    content: contentString
	  });

	  marker.addListener('click', function() {
	    infowindow.open(map, marker);
	  });

	  marker.setMap(map);	

}


var hash = new Object();
var callInsta = function() {
    $.ajax({
          type: "GET",
          url: "api/instagram",
          dataType: "json",
          success: function(data){
            // console.log(data[0].id);
            data.forEach(function(entry){
              if(hash[entry.id] == undefined){
                // $("#fucku").append(entry.id); 
                hash[entry.id] = 1
                sid.push({lng: entry.longitude, lat: entry.latitude});
                //console.log("Before setMarker method")
                setMarkerInsta(entry);
                console.log(sid);
              }
            }); 
          }
        });
}

function setMarkerTweet(twoots){
	var tLatLng
	var image = {
		url: 'images/twitter_mark.png'
	}
	tLatLng = new google.maps.LatLng(twoots.coordinates.coordinates[1], twoots.coordinates.coordinates[0]);
    var marker = new google.maps.Marker({
		position: tLatLng,
		animation: google.maps.Animation.DROP,
		title: 'Hello World!',
		icon: image
	}); 
	var contentString = '<div id="content">'+
	  '<div id="siteNotice">'+
	  '</div>'+
	  '<h1 id="firstHeading" class="firstHeading">'+ twoots.user.screen_name +'</h1>'+
	  '<div id="bodyContent">'+
	  '<img src="'+ twoots.user.profile_image_url +'" alt="Smiley face" height="150" width="150">' +
	  '<p>'+ twoots.text +'</p>'+
	  '</div>'+
	  '</div>';

	  var infowindow = new google.maps.InfoWindow({
	    content: contentString
	  });

	  marker.addListener('click', function() {
	    infowindow.open(map, marker);
	  });

	  marker.setMap(map);	

}

callInsta();
// setInterval(callInsta, 30000000);
console.log("dbtwets")
console.log(dbtweets);



$(document).ready(function() {

    // Place JavaScript code here...
    //Creating a socket which listens http://127.0.0.1:1339/
    var socket = io.connect("http://159.203.30.16:3020/");

    //Accessing ul element on page 
    var ul = document.getElementById('tweets');

    //On tweet event (when we receave a tweet)
    socket.on('tweet',function (tweet) {

        callInsta();

        //Creating a li element
        var li = document.createElement("li");
        li.innerHTML  = "<strong>" + tweet.user.screen_name + ":</strong> " + tweet.text + " " + tweet.coordinates;

        //Insert ul at the top of the list
        ul.insertBefore(li,ul.getElementsByTagName("li")[0]);

        sid.push([{lng: tweet.coordinates.coordinates[0], lat: tweet.coordinates.coordinates[1]}]);

        var myLatLng = {lng: tweet.coordinates.coordinates[0], lat: tweet.coordinates.coordinates[1]};

        var myLatlng = new google.maps.LatLng(tweet.coordinates.coordinates[1],tweet.coordinates.coordinates[0]);

		var image = {
			url: 'images/twitter_mark.png'
		}
        var marker = new google.maps.Marker({
    		position: myLatlng,
    		animation: google.maps.Animation.DROP,
    		title: 'Hello World!',
    		icon: image
  		});   

  		var contentString = '<div id="content">'+
	      '<div id="siteNotice">'+
	      '</div>'+
	      '<h1 id="firstHeading" class="firstHeading">'+ tweet.user.screen_name +'</h1>'+
	      '<div id="bodyContent">'+
	      '<img src="'+ tweet.user.profile_image_url +'" alt="Smiley face" height="150" width="150">' +
	      '<p>'+ tweet.text +'</p>'+
	      '</div>'+
	      '</div>';

		  var infowindow = new google.maps.InfoWindow({
		    content: contentString
		  });

		  marker.addListener('click', function() {
		    infowindow.open(map, marker);
		  });		  

  		marker.setMap(map);

    });



});
