var searchButton = document.querySelector('.btn-submit');
var previousButton = document.querySelector('.btn-prev');

//access token for Mark's google api account
const googleApiKey = "AIzaSyD-9tSrkeQiwvdz8Mj6PelMkvzqjqWhP7w";

//google map
var map;
var service;

//holding variables
var distance = 1;
var price;
var lon;
var lat;
var finalDestination;
var mapMarkers = [];
var directionsDisplay;
var directionsService;

var localStorageHistory = JSON.parse(localStorage.getItem('localStorageHistory')) || [];
var previousRandomNumber = 0;
var previous = false;
var homeMarker;
var totalResults = [];

//callback function for initializing the google map
function initMap() {

    //arbitrary holding location for the map until User approves app to know location
    var minneapolis = { lat: 44.9778, lng: -93.2650 };

    map = new google.maps.Map(document.getElementById("map"), {
        center: minneapolis,
        zoom: 5
    });
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService = new google.maps.DirectionsService;
    service = new google.maps.places.PlacesService(map);
    //documentation for service https://developers.google.com/maps/documentation/javascript/reference/places-service?hl=en
}

//geolocation for user's position, after user allows the browser to know their position
navigator.geolocation.getCurrentPosition((position) => {
    var coordinates = {lat: position.coords.latitude, lng: position.coords.longitude};
    lat = coordinates.lat;
    lon = coordinates.lng;

    map = new google.maps.Map(document.getElementById("map"), {
        center: coordinates,
        zoom: 15
    });

    homeMarker = new google.maps.Marker({
        position: coordinates,
        map
    });

    service = new google.maps.places.PlacesService(map);

    getLocalRestaurants(lon, lat, distance, price)
});


//Event listener for search button
searchButton.addEventListener('click', function (e) {
    e.preventDefault();

    //get distance entry
    var distanceEntry = document.querySelector('#distance-entry');
    distanceEntry = distanceEntry.options[distanceEntry.selectedIndex].value;
    distanceEntry = distanceEntry * 1609.34;

    //get price entry
    var priceEntry = document.querySelector('#price-entry');
    priceEntry = priceEntry.options[priceEntry.selectedIndex].value;

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

    //pass entries and preferences to getUserLocation function to collect restaurant data
    getLocalRestaurants(lon, lat, distanceEntry, priceEntry)

    //hides map and displays waiting text while randomizer cycles through array
    $('#map').addClass('container-disappear');
    $('#holdingText').removeClass('container-disappear');
    $('.container-hide').css('display', 'none')

});

//get local restaurants from Google Places API
function getLocalRestaurants(lon, lat, distance, price) {

    var request = {
        location: { lat: lat, lng: lon },
        radius: distance,
        types: ['restaurant', 'food', 'bar', 'meal_takeaway', 'meal_delivery'],
        maxPriceLevel: price,
        minPriceLevel: price
        };

    //change map center to user location
    map.setCenter({ lat: lat, lng: lon });

    //change the zoom of the map
    var zoomLevel = 13;
    map.setZoom(zoomLevel);

    //Finds resulting businesses within a radius of the specified distance. Google organizes results as an array of no more than 20 elements which must be paginated through to acquire the full selection.
    service.nearbySearch(
        request, (results, status, pagination) => {
            if (status !== 'OK' || !results) {
                $('#holdingText').addClass('container-disappear');
                $('#map').removeClass('container-disappear');
                return;
            }

            //Compiles all pages of results into a single array
            totalResults = totalResults.concat(results);
            pagination.nextPage()

            //sends the results of the restaurant search to the generateRandomPlaces function
            if (pagination.hasNextPage === false || totalResults.length === 100) {

                generateRandomPlace(totalResults);

                //displays map again and hides waiting text
                $('#holdingText').addClass('container-disappear');
                $('#map').removeClass('container-disappear');

            };
        }
    )
}

//adds all the places provided by the getLocalRestaurants function to the map
function generateRandomPlace(places) {
    
    //loops through every places(restaurant object) and adds it to the map
    var randomIndex = Math.floor(Math.random() * places.length)

    while (randomIndex == previousRandomNumber) {
        randomIndex = Math.floor(Math.random() * places.length)
    }
    
    var place = places[randomIndex];
    
    addMarker(place);
}

/*adds a marker to the given place on the map
if the place has a geometry property it is a restaurant */
function addMarker(place, previous) {
    if (place.geometry && place.geometry.location) {
        //if place is a restaurant
        if (!previous) {
            localStorageHistory.push(place);
            localStorage.setItem("localStorageHistory", JSON.stringify(localStorageHistory));
            finalDestination = place;
        }
        else {
            finalDestination = place;
            localStorage.setItem("localStorageHistory", JSON.stringify(localStorageHistory))

        }

        //remove previous markers
        if (mapMarkers.length > 0) {
            mapMarkers[0].setMap(null);
            mapMarkers = [];
        }
        homeMarker.setMap(null);

        //Set new map to include both user location and destination and set new marker on the destination
        const image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
        };

        var marker = new google.maps.Marker({
            map,
            icon: image,
            title: place.name,
            position: place.geometry.location,
        });

        mapMarkers.push(marker);
        mapMarkers[0].setMap(map);

        //as soon as the marker is placed, set the route
        setRoute();

        //place details, appears above map
        $('.container-hide').css('display', 'flex')
        $('#name').text(place.name)
        $('#address').text(place.vicinity)
    };
};

//Function for Previous button
previousButton.addEventListener('click', function (e) {
    e.preventDefault();

    if (localStorageHistory.length > 0) {
        var loadMarker = localStorageHistory;

        previous = true;
        addMarker(localStorageHistory.pop(), previous);
        previous = false;
    }
});

//sets the route between the user and the restaurant
function setRoute() {
    //the request for the route path from the user(origin) to the restaurant(finalDestination)
    var request = {
        origin: { lat: lat, lng: lon },
        destination: finalDestination.geometry.location,
        travelMode: 'DRIVING'
    };

    //adds the route request to the directions service route function
    directionsService.route(request, (result, state) => {

        if (state == 'OK') {
            directionsDisplay.setDirections(result);
            directionsDisplay.setMap(map);
        }
    });
}