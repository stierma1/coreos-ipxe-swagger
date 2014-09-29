'use strict';

require('rootpath')();
var resMan = require('lib/resource-manager.js');
var path = require('path');
var Fiber = require('fibers');
var utils = require('lib/utils.js');
var jsYML = require('js-yaml');
var auth = require('lib/auth-middleware');
var initVars = require('lib/initial-variables.js');

var script = '#!ipxe\r\n' +
'set coreos-version {{.Version}}\r\n' +
'set base-url http://{{.BaseUrl}}/images/amd64-usr/${coreos-version}\r\n' +
'kernel ${base-url}/coreos_production_pxe.vmlinuz{{.Options}}\r\n' +
'initrd ${base-url}/coreos_production_pxe_image.cpio.gz\r\n' +
'boot\r\n';


//handlers for /{profile}/{id}
module.exports = {

    get: function ipxeGet(req, res) {
        //respond with string
        Fiber(function(){
          getScript(req,res)
        }).run();
    },

    put: [
      auth(),
      function ipxePut(req, res) {
        Fiber(function(){
          putMac(req,res)
        }).run();
      }
    ]

};

var putMac =
  function (req, res) {
      var partialPath = 'profiles' + path.sep + req.params.profile + path.sep + (req.params.id ? req.params.id + '.json' : 'default.json');
      try{
        try{
          resMan.validPartialPath('profiles' + path.sep + req.params.profile );
        } catch(err){
          resMan.createDirectory('profiles' + path.sep + req.params.profile );
        }
        resMan.write(partialPath, JSON.stringify(req.body));
        res.status(200).end();
      } catch(err){
        res.status(400).send(err.message);
      }
  };

var getScript = function(req, res){
  console.log("Get Request for " + req.params.profile + (req.params.id ? '/' + req.params.id : ''));
  var partialPath = 'profiles' + path.sep + req.params.profile + path.sep + (req.params.id ? req.params.id + '.json' : 'default.json');

  var profile = JSON.parse(resMan.read(partialPath));

  var cloud_conf = initVars.COREOS_IPXE_SERVER_BASE_URL + '/configs/' + profile.cloud_config;
  if(profile.cloud_config_version){
    cloud_conf += '?version=' + profile.cloud_config_version;
  }

  if(profile.sshkey){
    try{
      var sshkey = resMan.get('/sshKeys/' + profile.sshkey);
    } catch(err){
      res.status(400).send("Unable to retrieve sshkey");
      return;
    }
  }

  var optString = "";
  optString += profile.rootfstype ? ('  rootfstype=' + profile.rootfstype) : '';
  for(var i in profile.console){
    optString += ' console=' + profile.console[i];
  }
  optString += ' cloud-config-url=http://' + cloud_conf;
  optString += profile.coreos_autologin ? (' coreos.autologin=' + this.coreos_autologin): '';
  optString += profile.sshkey ? (' sshkey="' + sshkey + '"') : '';
  optString += profile.root ? (' root=' + profile.root) : '';

  var scriptVariables = {
    '{{.Version}}' :'',
    '{{.BaseUrl}}' : '',
    '{{.Options}}' : ''
  };

  scriptVariables['{{.Version}}'] = profile.version;
  scriptVariables['{{.BaseUrl}}'] = initVars.COREOS_IPXE_SERVER_BASE_URL;
  scriptVariables['{{.Options}}'] = optString;
  var genScript = script + '';
  for(var i in scriptVariables){
    genScript = genScript.replace(i, scriptVariables[i]);
  }
  res.set({'Content-Type': 'text/plain'})
  res.status(200).send(genScript);
}
