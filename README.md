# Project 1: NOWHERE SPECIAL 

# Creators - Craig Bailey, Logan Sutton, Mark Ustby

## Synopsis

You and your partner, friends, or family are sitting around and someone brings up going to get food but no one has any clue on what they want. 
You all sit around for the next 10-20 minutes debating your options and how much you're willing to spend. 
With ‘Nowhere Special’ the decision can be made in as little as 30 seconds. 
Just input how far you are willing to travel and your price point and ‘Nowhere Special’ will give you a random restaurant selection near you with all your specifications without any arguments or debates.

## Description

Almost everyone has had the experience: you want to go out to eat–-whether individually or with others–-but can’t decide where to go. If nobody feels strongly one way or another, why not let an app randomly select a place for you?

This simple, everyday dilemma provides the motivation behind the development of `Nowhere Special`. Using only a simple set of parameters and the Google Map, Places, and Directions APIs, with user geolocation, this app can quickly offer a random selection of nearby eatery options. See the `Usage` section below for details on the user experience of the app.

Despite its simple user interface, and few features and parameters, this project required a significant amount of JavaScript coding as well as research into the dense documentation of the Google APIs, and thus had a steep, but necessarily rapid learning curve.

Because of this coding challenge, developing the app was a test of understanding and applying basic to intermediate level JavaScript coding. Although many parts of the code may have been based on online research, particularly in taking advantage of the Google APIs, adapting and implementing that code in the context of our app was rigorous but rewarding educational experience. 

## User Story
```
AS a consumer
I WANT to be be given a suggestion of where to eat within a given distance and price point
SO THAT I can expedite the process of choosing with less debate or equivocation;
```

## Acceptance Criteria
```
GIVEN an interface with a map and dropdown menus

WHEN I load the page
THEN the map centers on my location.

WHEN I select a distance and price point and click the search button
THEN I am presented with a single restaurant selection within the given specifications.

WHEN the restaurant selection is given
THEN the map presents visual directions from my location to the selected restaurant and a card appears showing the restaurant's name and address.

WHEN I click the Search button again
THEN I am presented with a different restaurant selection within the given specifications.

WHEN I click the Previous button
THEN the previous search result is presented again, even upon page refresh.

```

## Development

The `Nowhere Special` app makes use of the Google Map, Places, and Directions APIs for its core functionality, supplemented with the Materialize CSS library, and supporting JavaScript, as well as a little JQuery. Otherwise, the app is based on standard HTML, CSS, and JavaScript coding.

The original premise for `Nowhere Special` was proposed by Craig Bailey, coming out of previous discussions with a friend. Although this app is developed as a class group project, it has the potential for further future expansion and refinement. Requirements for this project were that it be responsive, take advantage of at least two third-party APIs (here, the Google APIs), take advantage of a CSS library other than Bootstrap (here, Materialize), and that it make use of local storage (saves user history, accessed through the `Previous` button).

The primary research and implementation of the APIs was provided on this project by Mark Ustby, which included making the map function, finding restaurants within the given distance of the point of reference, setting the driving route to the destination, and saving the search history. Craig Bailey established the primary HTML and CSS as well as developing the randomization code, checking the price points, and helping on the search parameters. Logan Sutton inserted the geolocation for the user and the compilation of large sets of results data to feed into the random selection, as well as providing general editing and troubleshooting of the JavaScript, HTML, and CSS, writing the supplementary documentation, and managing the GitHub repository. All three authors tested the app and took notes of areas for future refactoring and additions.

### Future Development
The app as it stands, while functional, is essentially a prototype on which many more features could be built to accommodate the user experience.
Perhaps the first item to address in any future development is to include additional--or at least 'advanced' optional parameters the user can choose from. These would include 'types of cuisine' (American, Mexican, steakhouse, Chinese, fast food, etc), 'review level' (only 3 star ratings and above, indifferent to rating, etc), and the ability to search areas outside of the user's current location: for example, if someone were travelling and wanted to grab a good meal as soon as they arrived in an unfamiliar city.

Additionally, we might add more information on the restaurant that is selected: hours of operation, phone and online contacts, or access to online menus.

Other features we might consider adding would be a more detailed search history, so that a user could return to a previous random selection that they'd like to revisit (but perhaps forget the name of), or also a user rating system, so that the user could provide their own feedback on a restaurant: a downranking would remove an option from the random selection entirely or reduce how often it is selected, while an upranking might increase the chances of the restaurant being chosen again in future.

Meal selection being such a constantly contentious issue in modern life, we could imagine this app exploding with features as it is implemented and tested.

## Link to Deployed App

https://lston40.github.io/project_1_group_UI/

## Usage and Screenshots

The user is first presented with a map and two dropdown menus--one for distance from user location, and one for price point. Upon page load, the user will be asked whether they are willing to share their location. (The map is centered on Minneapolis, MN with a wide zoom as default):

assets/images/loading_screen.png

After giving the app permission, the map will zoom to the approximate user location, pinning a marker:

assets/images/user_location.png

The user must then select a distance range from their location (5, 10, 25, 50, or 100 miles) as well as a price range of low (`$`), medium (`$$`), or high (`$$$`), and then clicks `Search`. The app will randomly select a restaurant within the distance range and price point and will immediately display a card with the restaurant name and address. The map will show the default optimal driving route from the user location to the restaurant:

assets/images/random_selection.png

If the user is dissatisfied with the first random selection, they may click `Search` again to pick another random selection using the same parameters. Or, they may change the parameters and run a new search. Or finally, they may click the `Previous` button to return to a previous search result.


## Credits

This app makes use of three Google APIs (https://console.cloud.google.com/apis/library?supportedpurview=project): 
-- Google Maps Javascript API (https://console.cloud.google.com/apis/library/maps-backend.googleapis.com?supportedpurview=project), 
-- Google Places API (https://console.cloud.google.com/apis/library/places-backend.googleapis.com?supportedpurview=project)
-- Google Directions API (https://console.cloud.google.com/apis/library/directions-backend.googleapis.com?supportedpurview=project)