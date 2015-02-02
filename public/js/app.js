'use strict';
var app = angular.module('blog', ['ngSanitize', 'ngRoute'])

app.factory('config', function(){
	var config = {}
	config.categories = [
		{
			"en": 'technology', 
			"ch": "技术"
		},
		{
			"en": "util",
			"ch":  "工具"
		},
		{
			"en": "source",
			"ch":  "资源"
		}
	 ];
	return config;
});

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/topic/:topicId', 
		{
			controller: 'TopicDetail',
			templateUrl: 'partials/info.html'
		}
	) 
}]);
