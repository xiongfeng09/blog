var topic = require('./topic');
var user = require('./user');

module.exports = function(app) {
    app.get('/', function (req, res) {
        
        res.render('index', { title: 'Express' });
    });

    // app.get('/register', checkNotLogin);
    app.get('/register', user.showRegister);  // 跳转到注册页面

    // app.post('/register', checkNotLogin);
    app.post('/register', user.register);  //  注册页面

    function checkLogin(req, res, next) {
        if (!req.session.user) {
          req.flash('error', '未登录!'); 
          res.redirect('/login');
        }
        next();
      }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
          req.flash('error', '已登录!'); 
          res.redirect('back');//返回之前的页面
        }
        next();
    }
};