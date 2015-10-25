
$.ajax({
  type: "GET",
  url: "api/instagram",
  dataType: "json",
  success: function(data){
    console.log(data[0].id);
    // var json = jQuery.parseJSON(data);
    data.forEach(function(entry){
      $("#fucku").append(entry.id);  
    }); 
  }
});


var sid = [];
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.411087, lng: -80.475802},
    zoom: 10
  });
}
$(document).ready(function() {

    // Place JavaScript code here...
    //Creating a socket which listens http://127.0.0.1:1339/
    var socket = io.connect("http://159.203.30.16:3020/");

    //Accessing ul element on page 
    var ul = document.getElementById('tweets');

    //On tweet event (when we receave a tweet)
    socket.on('tweet',function (tweet) {

        //Creating a li element
        var li = document.createElement("li");
        li.innerHTML  = "<strong>" + tweet.user.screen_name + ":</strong> " + tweet.text + " " + tweet.coordinates;

        //Insert ul at the top of the list
        ul.insertBefore(li,ul.getElementsByTagName("li")[0]);

        sid.push([{lng: tweet.coordinates.coordinates[0], lat: tweet.coordinates.coordinates[1]}]);

        var myLatLng = {lng: tweet.coordinates.coordinates[0], lat: tweet.coordinates.coordinates[1]};

        var myLatlng = new google.maps.LatLng(tweet.coordinates.coordinates[1],tweet.coordinates.coordinates[0]);

        var marker = new google.maps.Marker({
    		position: myLatlng,
    		animation: google.maps.Animation.DROP,
    		title: 'Hello World!',
  		});   

  		var contentString = '<div id="content">'+
	      '<div id="siteNotice">'+
	      '</div>'+
	      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
	      '<div id="bodyContent">'+
	      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
	      'sandstone rock formation in the southern part of the '+
	      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
	      'south west of the nearest large town, Alice Springs; 450&#160;km '+
	      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
	      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
	      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
	      'Aboriginal people of the area. It has many springs, waterholes, '+
	      'rock caves and ancient paintings. Uluru is listed as a World '+
	      'Heritage Site.</p>'+
	      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
	      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
	      '(last visited June 22, 2009).</p>'+
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
