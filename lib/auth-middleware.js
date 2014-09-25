var basicAuth = require('basic-auth-connect');

module.exports = function(){
  return basicAuth('username', 'password');
}
