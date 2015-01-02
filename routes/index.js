var topic = require('./topic');
var user = require('./user');

module.exports = function(app) {
    app.get('/', topic.list);

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

    app.get('/topic/create', checkLogin);
    app.get('/topic/create', topic.showCreate);

    app.post('/topic/create', checkLogin);
    app.post('/topic/create', topic.create);
    
    app.get('/topic/:tid', topic.info);  // 显示某个话题

    app.get('/topic/:tid/edit', checkLogin);
    app.get('/topic/:tid/edit', topic.showEdit); 

    app.post('/topic/:tid/edit', checkLogin);
    app.post('/topic/:tid/edit', topic.edit);

    app.get('/topic/:tid/delete', checkLogin);
    app.get('/topic/:tid/delete', topic.delete);

    app.get('/topic/category/:id', topic.listByCategory);
    app.get('/topic/tag/:id', topic.listByTag);

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