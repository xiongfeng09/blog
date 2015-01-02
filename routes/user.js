var crypto = require('crypto');
var User = require('../proxy').User;
var mongoose = require('mongoose');
var validator = require('validator');

//sign up
exports.showRegister = function (req, res) {
    res.render('register', {
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
};

//sign up
exports.register = function (req, res) {
    var name = validator.trim(req.body.name).toLowerCase(),
        password = validator.trim(req.body.password),
        password_re = validator.trim(req.body['password-repeat']),
        email = validator.trim(req.body.email).toLowerCase();

    // 验证信息的正确性
    if ([name, password, password_re, email].some(function (item) { return item === ''; })) {
        req.flash('error', '信息不完整!'); 
        return res.redirect('/register');//返回主册页
    }

    if (name.length < 1) {
        req.flash('error', '用户名至少需要1个字符!'); 
        return res.redirect('/register');//返回主册页
    }

    //检验用户两次输入的密码是否一致
    if (password_re != password) {
        req.flash('error', '两次输入的密码不一致!'); 
        return res.redirect('/register');//返回主册页
    }
    // END 验证信息的正确性

    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    //检查用户名是否已经存在 
    User.getUsersByQuery({'$or': [
        {'name': name},
        {'email': email}
    ]}, {}, function (err, users) {
        if (users) {
            req.flash('error', '用户名或邮箱已存在');
            return res.redirect('/register');//返回注册页
        }
        //如果不存在则新增用户
        User.newAndSave(name, password, function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/register');//注册失败返回主册页
            }
            req.session.user = user;//用户信息存入 session
            req.flash('success', '注册成功!');
            res.redirect('/');//注册成功后返回主页
        });
    });
};

//log out
exports.logout = function (req, res) {
    req.session.user = null;
    req.flash('success', '登出成功!');
    res.redirect('/');//登出成功后跳转到主页
}

