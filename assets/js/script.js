var searchButton = document.querySelector('.btn');


//   $(document).ready(function(){
//     $('select').formSelect();
//   }); 


// var openTable = 'https://opentable.herokuapp.com/api/cities';

var openTable = 'https://api.yelp.com/v3/businesses/search?term=restaurants';
var restaurantFind = fetch(openTable)
        .then(function(response) {
            return response.json()
        })
        .then(function(output) {

            console.log(output);
            // for (i=0; i < output.length; i++) {
            //     var restLat = output[i].lat;
            //     var restLong = output[i].long;


            // }

        });
        

//access token for Marks mapbox acocunt
var accessToken = 'pk.eyJ1IjoibWFya3VzdGJ5IiwiYSI6ImNsNWQyZGF6MDBkdmIzY254dGVyeGcxMWMifQ.WHs2hUKaGpUs7G3tJpsMNQ'


//minneapolis lon and lat
function getLocation() {
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        resolve({ lat: coords.latitude, lon: coords.longitude });
      });
    });
  }
  
  getLocation()
      .then(data => {
          // Use the user's location information for weather/etc.
          console.log(data);
          return data;
      }); 


var center = [-93.2650, 44.9778];


//sets up mapbox map
mapboxgl.accessToken = accessToken;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: center,
    zoom: 14
});

// https://api.mapbox.com/geocoding/v5/mapbox.places/55902.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=YOUR_MAPBOX_ACCESS_TOKEN




//Event listener for search button

searchButton.addEventListener('click', function (e) {
    e.preventDefault();
    //get zip entry
    var zipEntry = document.querySelector('#zip-entry').value;
    //get distance entry
    var distanceEntry = document.querySelector('#distance-entry');
    distanceEntry = distanceEntry.options[distanceEntry.selectedIndex].value;
    console.log(distanceEntry);
    //get price entry
    var priceEntry = document.querySelector('#price-entry');
    priceEntry = priceEntry.options[priceEntry.selectedIndex].value;
    console.log(priceEntry);
    //get food type entry
    //var foodTypeEntry = document.querySelector('.food-type-entry').value;



    //pass entries to getUserLocation function
    getUserLocation(zipEntry);


});


//uses the mapbox geocoding api to get the user's location
function getUserLocation(zip) {
    var api = `https://api.mapbox.com/geocoding/v5/mapbox.places/${zip}.json?proximity=ip&types=place%2Cpostcode%2Caddress%2Cpoi&access_token=${accessToken}`;

    console.log(zip);
    console.log("fetching user location");
    fetch(
        api
    ).then(
        res => data = res.json()
    ).then(data =>{
        console.log(data);
        //"city, state zip, country"
        var place_name = data.features[0].place_name;
        //returns name of city
        var city = data.features[0].context[0].text;
        var lon = data.features[0].geometry.coordinates[0]
        var lat = data.features[0].geometry.coordinates[1]
        console.log(place_name + " " + city + " " + lon + " " + lat);
        
        console.log("lon: " + lon + " lat: " + lat);
        map.flyTo({
            center: [lon, lat]
        });

    }).catch(err => console.log(err));
    


}

// getUserLocation(55902);









//Save data locally

// localStorage.setItem('x', y);

// localStorage.getItem('x');