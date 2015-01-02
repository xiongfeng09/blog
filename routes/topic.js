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
            return res.render('topic/create', {
                error: err,
                title: title,
                content: content,
                category: category,
                tag: tag
            });
        }

        req.flash('success', '记录成功!');
        res.redirect('/topic/' + topic._id);
    });
  }

//showEdit
exports.showEdit = function (req, res, next) {
    var topic_id = req.params.tid;
        if (topic_id.length !== 24) {
        req.flash('error',  '此话题不存在或已被删除。')
        return res.redirect('/');
    }
    Topic.getTopicById(topic_id, function(error, topic){
        if (error) {
            req.flash('error',  '此话题不存在或已被删除。')
            return res.redirect('/');
        }

        if (req.session.user._id != topic.author_id) {
             req.flash('error', '无权限');
             return  res.redirect('/topic/' + topic._id);
        }

        res.render('topic/create',{
            action: "edit",
            title: topic.title,
            content: topic.content,
            category: topic.category,
            tag: topic.tag,
            id: topic._id
        });
    });
};

//edit
exports.edit = function (req, res, next) {
    var title = validator.trim(req.body.title);
    var category = req.body.category;
    var tag = req.body.tag;
    var content = req.body.content;
    var topic_id = req.params.tid;
    // 验证
    var editError;
    if (title === '') {
        editError = '标题不能是空的。';
    } else if (title.length < 5 && title.length > 100) {
        editError = '标题字数太多或太少。';
    }
    // END 验证
    if (editError) {
        return res.render('topic/edit/' + topic_id, {
            error: editError,
            title: title,
            content: content,
            category: category,
            tag: tag,
            id: topic_id
        });
    }

    Topic.getTopicById(topic_id, function (err, topic) {
        if (err) {
            return res.render('topic/edit/' + topic_id, {
                error: err,
                title: title,
                content: content,
                category: category,
                tag: tag,
                id: topic_id
            });
        }

        if (req.session.user._id != topic.author_id) {
             req.flash('error', '无权限');
             return  res.redirect('/topic/' + topic._id);
        }

        topic.title  = title;
        topic.category = category;
        topic.tag = tag;
        topic.content = content;
        topic.save();

        req.flash('success', '修改成功!');
        res.redirect('/topic/' + topic._id);
    });
};

//delete
exports.delete = function (req, res, next) {
    var topic_id = req.params.tid;

    Topic.getTopicById(topic_id, function (err, topic) {
        if (err) {
            req.flash('error', '此话题不存在或已被删除!');
            return res.redirect('/');
        }

        if (req.session.user._id != topic.author_id) {
             req.flash('error', '无权限');
             return res.redirect('/');
        }

        topic.remove(function (err) {
            if (err) {
                 req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '删除成功!');
            res.redirect('/');
        });
    });
};

//info
exports.info = function (req, res, next) {
    var topic_id = req.params.tid;
    if (topic_id.length !== 24) {
        req.flash('error',  '此话题不存在或已被删除。')
        return res.redirect('/');
    }
    Topic.getTopicById(topic_id, function(error, topic){
        if (error) {
            req.flash('error',  '此话题不存在或已被删除。')
            return res.redirect('/');
        }
        topic.visit_count += 1;
        topic.save();

        // format date
        topic.friendly_create_at = tools.formatDate(topic.create_at, true);
        topic.friendly_update_at = tools.formatDate(topic.update_at, true);

        res.render('topic/info',{
            topic: topic,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
};
