'use strict';

/* Services */
app.service('blogService', function ($http, $location) {

	this.getNavs = function () {
 		return $http.get('/api/getNavs');
	}
	this.getTopic = function (id) {
		return $http.get('/api/topic/' + id);
	}
}); 
