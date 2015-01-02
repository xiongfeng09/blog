var crypto = require('crypto');
var User = require('../proxy').User;
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
    if ([name, password, password_re].some(function (item) { return item === ''; })) {
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
        password_md5= md5.update(password).digest('hex');
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
        User.newAndSave(name, password_md5, function (err, user) {
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

//show login
exports.showLogin = function(req, res){
    res.render('login', {
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
};

//login
exports.login = function(req, res){
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(validator.trim(req.body.password)).digest('hex');
    //检查用户是否存在
    User.getUserByName(req.body.name, function (err, user) {
      if (!user) {
        req.flash('error', '用户不存在!');
        return res.redirect('/login');//用户不存在则跳转到登录页
      }
      //检查密码是否一致
      if (user.password != password) {
        req.flash('error', '密码错误!');
        return res.redirect('/login');//密码错误则跳转到登录页
      }
      //用户名密码都匹配后，将用户信息存入 session
      req.session.user = user;
      req.flash('success', '登陆成功!');
      res.redirect('/');//登陆成功后跳转到主页
    });
};

//log out
exports.logout = function (req, res) {
    req.session.user = null;
    req.flash('success', '退出成功!');
    res.redirect('/');//登出成功后跳转到主页
};
