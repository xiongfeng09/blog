var User = require('../proxy').User;
var Topic = require('../proxy').Topic;
var mcache = require('memory-cache');
var xmlbuilder = require('xmlbuilder');
var eventproxy = require('eventproxy');

var limit = 10;

// 主页的缓存工作。主页是需要主动缓存的
setInterval(function () {
  // 只缓存第一页, page = 1。options 之所以每次都生成是因为 mongoose 查询时，
  // 会改动它
  var query = {};
  var options = { skip: (1 - 1) * limit, limit: limit, sort: '-top -last_reply_at'};
  var optionsStr = JSON.stringify(query) + JSON.stringify(options);
  Topic.getTopicsByQuery(query, options, function (err, topics) {
    mcache.put(optionsStr, topics);
    return topics;
  });
}, 1000 * 120); // 五秒更新一次
// END 主页的缓存工作

exports.index = function (req, res, next) {
  var page = parseInt(req.query.page, 10) || 1;
  page = page > 0 ? page : 1;

  var proxy = eventproxy.create('topics', 'pages',
    function (topics, pages) {
      res.render('index', {
        topics: topics,
        current_page: page,
        list_topic_count: limit,
        pages: pages,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  proxy.fail(next);

  // 取主题
  var query = {};
  var options = { skip: (page - 1) * limit, limit: limit, sort: '-top -update_at'};
  var optionsStr = JSON.stringify(query) + JSON.stringify(options);

  if (mcache.get(optionsStr)) {
    proxy.emit('topics', mcache.get(optionsStr));
  } else {
    Topic.getTopicsByQuery(query, options, proxy.done('topics', function (topics) {
      return topics;
    }));
  }
  // END 取主题

  // 取分页数据
  if (mcache.get('pages')) {
    proxy.emit('pages', mcache.get('pages'));
  } else {
    Topic.getCountByQuery(query, proxy.done(function (all_topics_count) {
      var pages = Math.ceil(all_topics_count / limit);
      mcache.put(JSON.stringify(query) + 'pages', pages, 1000 * 60 * 1);
      proxy.emit('pages', pages);
    }));
  }
};
