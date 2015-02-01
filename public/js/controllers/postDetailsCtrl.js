'use strict';

app.factory("MarkDownConverter", function(){
	var converter = Markdown.getSanitizingConverter();

	converter.hooks.chain("preBlockGamut", function (text, rbg) {
		return text.replace(/^ {0,3}""" *\n((?:.*?\n)+?) {0,3}""" *$/gm, function (whole, inner) {
			return "<blockquote>" + rbg(inner) + "</blockquote>\n";
		});
	});
        
	return converter;
});

app.controller('TopicDetail', function($scope, $routeParams, blogService, $location, MarkDownConverter) {
	$scope.preview = null;

	blogService.getTopic($routeParams.topicId)
	.success(function (topic, status, headers, config) {
		console.log(topic.content)
		console.log(MarkDownConverter.makeHtml(topic.content))
		topic.contentHtml = MarkDownConverter.makeHtml(topic.content)
		$scope.topic = topic
	})
});