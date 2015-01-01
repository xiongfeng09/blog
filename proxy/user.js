var models = require('../models');
var User = models.User;

/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginName 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByLoginName = function (name, callback) {
  User.findOne({'name': name}, callback);
};

exports.newAndSave = function (name, password, callback) {
  var user = new User();
  user.name = name;
  user.password= password;

  user.save(callback);
};

var makeGravatar = function (email) {
  return 'http://www.gravatar.com/avatar/' + utility.md5(email.toLowerCase()) + '?size=48';
};
exports.makeGravatar = makeGravatar;

exports.getGravatar = function (user) {
  return user.avatar || makeGravatar(user);
};
