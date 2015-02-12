'use strict';

app.controller('NavCtrl', function($scope, blogService) {
	$scope.close = function() {
		$mdSidenav('left').close()
	};
	blogService.getNavs()
	.success(function (navs, status, headers) {
		$scope.config_categories = navs.config_categories;
		$scope.categories = navs.categories;
		$scope.tags = navs.tags;

		$('.nav-stack').show();
	})
});