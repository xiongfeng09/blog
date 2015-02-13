'use strict';

/* Services */
app.service('blogService', function ($http, $location) {
	this.isAdmin = function () {
		return $http.get('/isAdmin');
	}
	this.getNavs = function () {
 		return $http.get('/api/getNavs');
	}
	this.getTopic = function (id) {
		return $http.get('/api/topic/' + id);
	}
	this.getLatestTopic = function () {
		return $http.get('/api/latest/topic');
	}
}); 
