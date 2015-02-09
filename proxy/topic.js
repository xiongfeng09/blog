var models = require('../models');
var Topic = models.Topic;
var User = require('./user');

/**
 * 根据主题ID获取主题
 * Callback:
 * - err, 数据库错误
 * - topic, 主题
 * - author, 作者
 * - lastReply, 最后回复
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.getTopicById = function (id, callback) {
  Topic.findOne({_id: id}, callback)
};

/**
 * 获取关键词能搜索到的主题数量
 * Callback:
 * - err, 数据库错误
 * - count, 主题数量
 * @param {String} query 搜索关键词
 * @param {Function} callback 回调函数
 */
exports.getCountByQuery = function (query, callback) {
  Topic.count(query, callback);
};

/**
 * 根据关键词，获取主题列表
 * Callback:
 * - err, 数据库错误
 * - count, 主题列表
 * @param {String} query 搜索关键词
 * @param {Object} opt 搜索选项
 * @param {Function} callback 回调函数
 */
exports.getTopicsByQuery = function (query, opt, callback) {
    Topic.find(query, {}, opt, callback);
};

// for sitemap
exports.getLimit5w = function (callback) {
  Topic.find({}, '_id', {limit: 50000, sort: '-create_at'}, callback);
};

/**
 * 根据主题ID，查找一条主题
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.getTopic = function (id, callback) {
  Topic.findOne({_id: id}, callback);
};


exports.newAndSave = function (title, category, tag, content, authorId, callback) {
    var topic = new Topic();
    topic.title = title;
    topic.category = category;
    topic.tag = tag;
    topic.content = content;
    topic.author_id = authorId;
    topic.save(callback);
};

exports.getTags = function (callback) {
    Topic.distinct('tag', {}, function(err, tags) {
        if (err) {
          return callback(err);
        }
        callback(
          null,
          tags.filter(function(e) {
            return !!e;
          })
        )
    });
};

exports.groupByTag = function(callback) {
    Topic.aggregate().group({ "_id": "$tag", "count": {"$sum": 1}, "topics":{"$push": "$$ROOT"}}).exec(callback);
};

exports.groupByCategory = function(callback) {
    Topic.aggregate().group({ "_id": "$category", "count": {"$sum": 1}, "topics":{"$push": "$$ROOT"}}).exec(callback);
};
