var Topic = require('../proxy').Topic;
var validator = require('validator');
var tools = require('../common/tools');

//show
exports.showCreate = function (req, res) {
    res.render('topic/create', {
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
};

//create
exports.create = function (req, res) {
    var title = validator.trim(req.body.title);
    var category = req.body.category;
    var tag = req.body.tag;
    var content = req.body.content;
    // 验证
    var editError;
    if (title === '') {
        editError = '标题不能是空的。';
    } else if (title.length < 5 && title.length > 100) {
        editError = '标题字数太多或太少。';
    }
    // END 验证
    if (editError) {
        return res.render('topic/create', {
            error: editError,
            title: title,
            content: content,
            category: category,
            tag: tag
        });
    }

    Topic.newAndSave(title, category, tag, content, req.session.user._id, function (err, topic) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/topic/create');//注册失败返回主册页
        }

        req.flash('success', '记录成功!')
        res.redirect('/topic/' + topic._id);
    });
  }

exports.index = function (req, res, next) {
    var topic_id = req.params.tid;
    if (topic_id.length !== 24) {
        req.falsh('error',  '此话题不存在或已被删除。')
        return res.render('/');
    }
    Topic.getTopicById(topic_id, function(error, topic){
        if (error) {
            req.falsh('error',  '此话题不存在或已被删除。')
            return res.render('/');
        }
        topic.visit_count += 1;
        topic.save();

        // format date
        topic.friendly_create_at = tools.formatDate(topic.create_at, true);
        topic.friendly_update_at = tools.formatDate(topic.update_at, true);

        res.render('topic/index',{
            topic: topic,
            user: req.session.user
        });
    });
};

