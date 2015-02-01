'use strict';

app.controller('NavCtrl', function($scope, blogService, config) {
    $scope.close = function() {
    $mdSidenav('left').close()
    };
    $scope.categories_config = config.categories;
    $scope.navs = blogService.getNavs()
    .success(function (navs, status, headers, config) {
        $scope.categories = navs.categories;
        $scope.tags = navs.tags;
    })
});