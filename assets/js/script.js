var searchButton = document.querySelector('.btn');

//access token for Marks google apiaccount
const googleApiKey = "AIzaSyD-9tSrkeQiwvdz8Mj6PelMkvzqjqWhP7w";
//access token for Marks mapbox account
var accessToken = "pk.eyJ1IjoibWFya3VzdGJ5IiwiYSI6ImNsNWQyZGF6MDBkdmIzY254dGVyeGcxMWMifQ.WHs2hUKaGpUs7G3tJpsMNQ";

//google map
var map;
var service;

//holding variables
var distance = 1;
var price;
var lon;
var lat;

//callback function for initializing the google map
function initMap() {

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

//geolocation for user's position, after user allows the browser to know their position
navigator.geolocation.getCurrentPosition((position) => {
    var coordinates = {lat: position.coords.latitude, lng: position.coords.longitude};
    lat = coordinates.lat;
    lon = coordinates.lng;
    console.log(position);

    map = new google.maps.Map(document.getElementById("map"), {
        center: coordinates,
        zoom: 15
    });
    
   
    console.log(map);
    service = new google.maps.places.PlacesService(map);
    getLocalRestaurants(lon, lat, distance, price)
});

//Event listener for search button
searchButton.addEventListener('click', function (e) {
    e.preventDefault();

    //get zip entry
    // var zipEntry = document.querySelector('#zip-entry').value;

    //get distance entry
    var distanceEntry = document.querySelector('#distance-entry');
    distanceEntry = distanceEntry.options[distanceEntry.selectedIndex].value;
    distanceEntry = distanceEntry * 1609.34;
    console.log(distanceEntry);
    //get price entry
    var priceEntry = document.querySelector('#price-entry');
    priceEntry = priceEntry.options[priceEntry.selectedIndex].value;
    console.log(priceEntry);

    // changes price point from user interface values to places api for price level; 0 and 1 are low and free, 2 is mid level, 3 and 4 are expensive and high end.
    // conditional formatting needed, which api call to use based on if priceEntry is provided
    var priceEntry2 
    if (priceEntry == '$') {
        priceEntry = 1;
    } else if (priceEntry == '$$') {
        priceEntry = 2;
    } else if (priceEntry == '$$$') {
        priceEntry = 3
        priceEntry2 = 4
    }

    //gets the general type of food the user wants
    //var foodTypeEntry = document.querySelector('.food-type-entry').value;

    //pass entries and preferences to getUserLocation function to collect restaurant data
    getLocalRestaurants(lon, lat, distanceEntry, priceEntry)

});


//get local restaurants from yelp business api
function getLocalRestaurants(lon, lat, distance, price) {

    console.log("inside getLocalRestaurants");

    var request = {
        location: { lat: lat, lng: lon },
        radius: distance,
        types: ['restaurant', 'food', 'bar'],
        maxPriceLevel: price,
        openNow: true
    };

    console.log(request);
    //change map center to user location
    map.setCenter({ lat: lat, lng: lon });
    //change the zoom of the map
    var zoomLevel = 13;
    map.setZoom(zoomLevel);

    //pagination is for indexing the results(pagination.next is the next page of results)
    service.nearbySearch(
        request, (results, status, pagination) => {
            if (status !== 'OK' || !results) {
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
    // for (const place of places) {
        //
        var randomIndex = Math.floor(Math.random() * places.length)
        console.log(randomIndex);
        var place = places[randomIndex];
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
                phone: place.formatted_phone_number,
            });

        }
    }
    //array of place
    //random variable
    //change the zoom to random variable, set color, then set center

// }