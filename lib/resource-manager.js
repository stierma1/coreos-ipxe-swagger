require('rootpath')();
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var initVars = require('lib/initial-variables.js');
var utils = require('lib/utils.js');
var versionRegex = /^v[0-9]+$/;
var request = Promise.promisify(require('request'));

function read(partialPath, encoding){
  var enc = encoding || 'utf8';
  var fullName = path.join(initVars.COREOS_IPXE_SERVER_DATA_DIR, partialPath);

  var data = utils.yield(fs.readFileAsync(fullName, enc));

  return data;
}

function write(partialPath, body){
  var fullName = path.join(initVars.COREOS_IPXE_SERVER_DATA_DIR, partialPath);

  utils.yield(fs.writeFileAsync(fullName, body));
}

function createDirectory(partialPath){
  var fullName = path.join(initVars.COREOS_IPXE_SERVER_DATA_DIR, partialPath);

  utils.yield(fs.mkdirAsync(fullName));
}

function getLatestVersion(partialPath){
  var fullName = path.join(initVars.COREOS_IPXE_SERVER_DATA_DIR, partialPath);

  var data = utils.yield(fs.readdirAsync(fullName));

  var max = 0;

  for(var i = 0; i < data.length; i++){
    if(versionRegex.test(data[i].replace('.yml',''))){
      var ver = parseInt(data[i].replace('.yml','').replace('v', ''));
      max = (max > ver ? max : ver);
    }
  }

  return max;
}

function validPartialPath(partialPath){
  var fullName = path.join(initVars.COREOS_IPXE_SERVER_DATA_DIR, partialPath);

  var data = utils.yield(function(){
    var defer = Promise.defer();
    fs.exists(fullName, function(contents){
      defer.resolve(contents);
    });
    return defer.promise;
  }());

  if(data){
    return fullName;
  } else {
    throw Error("Partial Path did not yield a valid identifier");
  }
}

function get(partialPath){
  var fullName = path.join(initVars.COREOS_IPXE_SERVER_LISTEN_ADDR, partialPath);

  var data = utils.yield(request('http://' + fullName));
  try{
    if(data[0].statusCode !== 200){
      var err = new Error("Unable to retrieve file");
    }
  } catch(err){

  }
  if(err){
    throw err;
  }

  return data[0].body;
}

module.exports.read = read;
module.exports.write = write;
module.exports.validPartialPath = validPartialPath;
module.exports.getLatestVersion = getLatestVersion;
module.exports.createDirectory = createDirectory;
module.exports.get = get;
