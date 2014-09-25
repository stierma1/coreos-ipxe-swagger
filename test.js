var server = require('./server.js')
console.log('Test')
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
console.log('start')
server.ready(function(){
  fs.readdirAsync(path(process.cwd(), 'test'))
    .then(function(files){
      files.map(function(file){
        require(file);
      })
    })
})
