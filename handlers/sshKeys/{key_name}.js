'use strict';

require('rootpath')();
var resMan = require('lib/resource-manager.js');
var path = require('path');
var Fiber = require('fibers');
var utils = require('lib/utils.js');
var initVars = require('lib/initial-variables.js');
var auth = require('lib/auth-middleware');

//handlers for /{key_name}
module.exports = {

    get: function getKey(req, res) {
        //respond with string
      Fiber(function(){
        var partialPath = 'sshkeys' + path.sep + req.params.key_name + '.pub';
        try{
          res.status(200).send(resMan.read(partialPath));
        } catch(err){
          res.status(400).send(err.message);
        }
      }).run();
    },

    put: [
      auth(),
      function putKey(req, res) {
        Fiber(function(){
          putKey(req,res)
        }).run();
      }
    ]

};

var putKey =
  function (req, res) {
      var partialPath = 'sshkeys' + path.sep + req.params.key_name + '.pub';
      try{
        resMan.write(partialPath, req.body);
        res.status(200).end();
      } catch(err){
        res.status(400).send(err.message);
      }
  };
