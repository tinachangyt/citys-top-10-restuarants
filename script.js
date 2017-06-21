//collect top 10 restaurants in cities
var foodApp = {};


foodApp.key = "9e95a17fb38c356eb06dcbb84f7350af";
foodApp.weatherKey = "62166a9499478fb8";



foodApp.init = function(){
	foodApp.getFoodPieces("city", 89);
	foodApp.events();
	foodApp.getWeatherPieces();
};


//input city name and hit submit to find the top 10 restaurants
foodApp.events = function(){
	$("form").on("submit", function(e){
		e.preventDefault();
		var userInput = $('input[type=text]').val();
		foodApp.getCityId(userInput);
	});
};



foodApp.getCityId = function(query) {
	$.ajax({
		url:"https://developers.zomato.com/api/v2.1/locations",
		method:"GET",
		dataType:"json",
		headers: {
			"user-key" : foodApp.key
		},
		data: {
			query: query
		}
	})
	.then(function(res) {
		var city_id = res.location_suggestions[0].city_id;
		foodApp.getFoodPieces("city", city_id);
		foodApp.smoothScroll('#restaurantList');
	});
};



foodApp.getFoodPieces = function (cityType, cityId) {
	$.ajax({
		url:"https://developers.zomato.com/api/v2.1/location_details",
		method:"GET",
		dataType:"json",
		headers: {
			"user-key" : foodApp.key
		},
		data: {
			entity_type: cityType,
			entity_id: cityId
		}
	}).then(function(res){
		foodApp.displayFoodPieces(res);
	});
};



foodApp.displayFoodPieces = function(foodData) {
	$("#restaurants").empty();
	foodData.best_rated_restaurant.forEach(function(object) {
		const nameEl = $('<h2 class="restaurantName">').text(object.restaurant.name);
		const cuisinesEl = $('<h4 class="cuisines">').text(object.restaurant.cuisines);
		const linkEl = $('<a><img class="zomatoLink" src="images/zomato-icon.png"></a>').attr("href", object.restaurant.url);
		const popularityEl = $('<p class="rating">').text("❤ " + object.restaurant.user_rating.aggregate_rating + " / 5");
		const addressEl = $('<h3 class="address">').text(object.restaurant.location.address);
		const mapEl = $('<a class="mapButton">Map</a>').attr("href", `https://www.google.ca/maps/dir//${object.restaurant.location.address}`).attr("target", "_blank");
		const imageEl = $('<img class="restaurantImg">').attr("src", object.restaurant.featured_image);

		$("#restaurants").append(nameEl, linkEl, imageEl, cuisinesEl, imageEl, popularityEl, addressEl, mapEl);
	});
};



foodApp.getWeatherPieces = function() {
	$.ajax({
		url:`https://api.wunderground.com/api/${foodApp.weatherKey}/conditions/q/autoip.json`,
		method:"GET",
		dataType:"jsonp"
	})
	.then(function(res){
		foodApp.displayWeatherPieces(res);
	});
};



foodApp.displayWeatherPieces = function(weather) {
	var weatherData = weather.current_observation;
	const weatherConditionEl = $("<p>").text(weatherData.icon);
	const weatherImgEl = $("<img>").attr("src", weatherData.icon_url);
	const cityEl = $("<p>").text(weatherData.observation_location.city);
	const tempEl = $("<p>").text(weatherData.temp_c + "°C");

	$("#weather").append(weatherImgEl, weatherConditionEl, tempEl, cityEl);
};



foodApp.smoothScroll = function(location) {
	$("html, body").animate({
		scrollTop: $(location).offset().top
	}, 500);
};



$(function(){
	foodApp.init();
});