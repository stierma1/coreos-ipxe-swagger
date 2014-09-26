require('rootpath')();

var env = {
  COREOS_IPXE_SERVER_BASE_URL :  (process.env.COREOS_IPXE_SERVER_BASE_URL || '127.0.0.1:4777'),
  COREOS_IPXE_SERVER_DATA_DIR : (process.env.COREOS_IPXE_SERVER_DATA_DIR || "/opt/coreos-ipxe-server"),
  COREOS_IPXE_SERVER_LISTEN_ADDR : (process.env.COREOS_IPXE_SERVER_LISTEN_ADDR || "127.0.0.1:4777"),
};

try{
  var config = require('config.js');
} catch(err){
  console.log('WARNING: No config file found')
}

var args = {};

var initVars = {};

for(var i in env){
  initVars[i] = env[i];
}
for(var i in config){
  if(initVars[i]){
    console.log('INFO: Environment variable "' + i + '" will be overwritten with config file value')
  }
  initVars[i] = config[i];
}
for(var i in args){
  if(initVars[i]){
    console.log('INFO: Variable ' + i + ' will be overwritten with arg value value')
  }
  initVars[i] = args[i];
}

module.exports = initVars;
