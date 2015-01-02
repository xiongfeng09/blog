var topic = require('./topic');
var user = require('./user');

module.exports = function(app) {
    app.get('/', function (req, res) {
        res.render('index', {
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.get('/register', checkNotLogin);
    app.get('/register', user.showRegister);  // 跳转到注册页面

    app.post('/register', checkNotLogin);
    app.post('/register', user.register);  //  注册页面

    app.get('/login', checkNotLogin);
    app.get('/login', user.showLogin);

    app.post('/login', checkNotLogin);
    app.post('/login', user.login);  //  注册页面

    app.get('/logout', checkLogin);
    app.get('/logout', user.logout);

    function checkLogin(req, res, next) {
        if (!req.session.user) {
          req.flash('error', '未登录!');
          res.redirect('/login');
        }
        next();
    };

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
          req.flash('error', '已登录!');
          res.redirect('/');//返回之前的页面
        }
        next();
    };
};