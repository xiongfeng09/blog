'use strict';

app.factory("MarkDownConverter", function(){
	var converter = Markdown.getSanitizingConverter();
	var Extra = Markdown.Extra.init(converter, {
		extensions: "all",
		highlighter: "prettify"
	});

	return Extra.converter;
});

app.controller('TopicDetail', function($scope, $routeParams, blogService, $location, MarkDownConverter, $sce) {
	blogService.getTopic($routeParams.topicId)
	.success(function (topic, status, headers, config) {
		if(topic) {
			topic.contentHtml = $sce.trustAsHtml(MarkDownConverter.makeHtml(topic.content));
			$scope.topic = topic

			$scope.$watch('topic.contentHtml',function(newValue,oldValue, scope){
				$("pre").addClass("prettyprint")
				window.prettyPrint()
			});
		} else {
			 $location.path("/");
		}
	})

	blogService.isAdmin().success(function (user, status, headers, config) {
		$scope.isAdmin = user.isAdmin
	})
});

app.controller('TopicLatest', function($scope, blogService, $location, MarkDownConverter, $sce) {
	// blogService.getTopic("54a800810ada2f4d0bc3436e")
	blogService.getLatestTopic()
	.success(function (topic, status, headers, config) {
		console.log(111112121)
		if(topic) {
			topic.contentHtml = $sce.trustAsHtml(MarkDownConverter.makeHtml(topic.content));
			$scope.topic = topic

			$scope.$watch('topic.contentHtml',function(newValue,oldValue, scope){
				$("pre").addClass("prettyprint")
				window.prettyPrint()
			});
		} else {
			 $location.path("/");
		}
	})

	blogService.isAdmin().success(function (user, status, headers, config) {
		$scope.isAdmin = user.isAdmin
	})
});
