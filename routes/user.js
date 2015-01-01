var crypto = require('crypto');
var User = require('../proxy').User;
var mongoose = require('mongoose');

//sign up
exports.showRegister = function (req, res) {
  res.render('register');
};

//sign up
exports.register = function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'],
        email = req.body.email;

    //检验用户两次输入的密码是否一致
    if (password_re != password) {
      req.flash('error', '两次输入的密码不一致!'); 
      return res.redirect('/register');//返回主册页
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    //检查用户名是否已经存在 
    User.getUserByLoginName(name, function (err, user) {
      if (user) {
        req.flash('error', '用户已存在!');
        return res.redirect('/register');//返回注册页
      }
      //如果不存在则新增用户
      User.newAndSave(name, password, function (err, user) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/register');//注册失败返回主册页
        }
        // req.session.user = user;//用户信息存入 session
        req.flash('success', '注册成功!');
        res.redirect('/');//注册成功后返回主页
      });
    });
};

