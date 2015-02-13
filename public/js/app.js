'use strict';
var app = angular.module('blog', ['ngSanitize', 'ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/topic/:topicId', 
		{
			controller: 'TopicDetail',
			templateUrl: 'partials/info.html'
		}
	) .when('/',
		{
			controller: 'TopicLatest',
			templateUrl: 'partials/info.html'
		}
	) 
}]);
