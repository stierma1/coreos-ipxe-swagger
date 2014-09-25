'use strict';

require('rootpath')();
var resMan = require('lib/resource-manager.js');
var path = require('path');
var Fiber = require('fibers');
var utils = require('lib/utils.js');
var jsYML = require('js-yaml');
var auth = require('lib/auth-middleware');
var versionRegex = /^v[0-9]+$/
//handlers for /{name}
module.exports = {

    get: function getCloudConfig(req, res) {
        //respond with string
      Fiber(function(){
        if(req.query.version && !versionRegex.test(req.query.version)){
          res.status(400).send("Improper version format. Must pass " + versionRegex.toString() );
          return;
        }

        var partialPath = 'configs' + path.sep + req.params.name + path.sep + (req.query.version ? req.query.version : 'latest') + '.yml';
        try{
          var identifier = resMan.validPartialPath(partialPath);
          res.status(200).sendFile(identifier);
        } catch(err){
          res.status(400).send(err.message);
        }
      }).run();
    },

    put: [
      auth(),
      function uploadCloudConfig(req, res) {
        Fiber(function(){
          putFunc(req,res)
        }).run();
      }
    ]

};

var putFunc =
  function (req, res) {
      var partialPath = 'configs' + path.sep + req.params.name;
      try{
        jsYML.safeLoad(req.body);
        try{
          resMan.validPartialPath(partialPath);
        } catch(err){
          resMan.createDirectory(partialPath);
        }

        var latestVersion = resMan.getLatestVersion(partialPath);

        resMan.write(partialPath + path.sep + 'latest.yml', req.body);
        resMan.write(partialPath + path.sep + 'v' + (latestVersion + 1) + '.yml', req.body);
        res.status(200).send('v' + (latestVersion + 1) + '.yml');
      } catch(err){
        res.status(400).send(err.message);
      }
  }
