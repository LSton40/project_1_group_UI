// var axios = require('axios');

var searchButton = document.querySelector('.btn');


//google map
var map;
var service;


//callback function for initializing the google map
function initMap() {
    console.log("inside initMap");
    //arbitrary location for the map
    var minneapolis = { lat: 44.9778, lng: -93.2650 };
    map = new google.maps.Map(document.getElementById("map"), {
        center: minneapolis,
        zoom: 5
    });
    console.log(map);
    service = new google.maps.places.PlacesService(map);
    //documentation for service https://developers.google.com/maps/documentation/javascript/reference/places-service?hl=en
}


//Event listener for search button

searchButton.addEventListener('click', function (e) {
    e.preventDefault();
    //get zip entry
    var zipEntry = document.querySelector('#zip-entry').value;
    //get distance entry
    var distanceEntry = document.querySelector('#distance-entry');
    distanceEntry = distanceEntry.options[distanceEntry.selectedIndex].value;
    distanceEntry = distanceEntry * 1609.34;
    console.log(distanceEntry);
    //get price entry
    var priceEntry = document.querySelector('#price-entry');
    priceEntry = priceEntry.options[priceEntry.selectedIndex];
    console.log(priceEntry);
    //gets the general type of food the user wants
    //var foodTypeEntry = document.querySelector('.food-type-entry').value;

    //pass entries and preferences to getUserLocation function to collect restaurant data
    getUserLocation(zipEntry, distanceEntry, priceEntry);


});


//uses the mapbox geocoding api to get the user's location
function getUserLocation(zip, distance, price) {
    var api = `https://api.mapbox.com/geocoding/v5/mapbox.places/${zip}.json?proximity=ip&types=place%2Cpostcode%2Caddress%2Cpoi&access_token=${accessToken}`;
    
    console.log(zip);
    console.log("fetching user location");
    fetch(
        api
    ).then(
        res => data = res.json()
    ).then(data => {
        console.log(data);
        //"city, state zip, country"
        var place_name = data.features[0].place_name;
        //returns name of city
        var city = data.features[0].context[0].text;
        var lon = data.features[0].geometry.coordinates[0]
        var lat = data.features[0].geometry.coordinates[1]
        console.log(place_name + " " + city + " " + lon + " " + lat);
    
        //calls getLocalRestaurants function
        getLocalRestaurants(lon, lat, distance, '$');

    }).catch(err => {
        console.log(err);
    }
    );



}

//get local restaurants from yelp business api
function getLocalRestaurants(lon, lat, distance, price) {

    console.log("inside getLocalResurants");

    var request = {
        location: { lat: lat, lng: lon },
        radius: distance,
        types: ['restaurant']
        // price: price
    };
    //change map center to user location
    map.setCenter({ lat: lat, lng: lon });
    //change the zoom of the map
    var zoomLevel = 13;
    map.setZoom(zoomLevel);
   
//pagination is for indexing the results(pagination.next is the next page of results)
    service.nearbySearch(
        request, (results, status, pagination) => {
            if(status !== 'OK' || !results){
                console.log(status);
                return;
            }
            //send the results of the restaurant search to the addPlaces function
            addPlaces(results);
        }
    )

}

//adds all the places provided by the getLocalRestaurants function to the map
function addPlaces(places) {
    //loops through every places(restaurant object) and adds it to the map
    for (const place of places) {
        //if the place has a geometry property it is a restaurant
        if (place.geometry && place.geometry.location) {
            
            const image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
            };

            new google.maps.Marker({
                map,
                icon: image,
                title: place.name,
                position: place.geometry.location,
            });
        }
    }
}
