'use strict';

require('rootpath')();
var resMan = require('lib/resource-manager.js');
var path = require('path');
var Fiber = require('fibers');
var utils = require('lib/utils.js');
var auth = require('lib/auth-middleware');

//handlers for /{version}
module.exports = {

    put: [
      auth(),
      function ipxePut(req, res) {
        Fiber(function(){
          putCritical(req,res)
        }).run();
      }
    ]

};

var putCritical =
  function (req, res) {
      var partialPath = path.join('images', 'amd64-usr' , req.params.version)
      try{
        try{
          resMan.validPartialPath(partialPath);
        } catch(err){
          resMan.createDirectory(partialPath);
        }

        var filename = req.files.upload.name;

        req.pipe(fs.createWriteStream(path.join(resMan.validPartialPath(partialPath), filename)))
          .on('close', function(){
            res.status(200).end();
          })
          .on('error', function(){
            res.status(400).end();
          })

      } catch(err){
        res.status(400).send(err.message);
      }
  }
