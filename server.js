var http = require('http');
var express = require('express');
var swaggerize = require('swaggerize-express');
var cors = require('cors');
var fs = require('fs');
var path = require('path');
var env = require('./lib/initial-variables');

var app = express();
var server = http.createServer(app);
var swagger = swaggerize({

    listing: require('./listings.json'),
    resources:[
      {
        api: require('./apis/profiles.json'),
        handlers: './handlers/profiles',
      },
      {
        api: require('./apis/images.json'),
        handlers: './handlers/images',
      },
      {
        api: require('./apis/configs.json'),
        handlers: './handlers/configs',
      },
      {
        api: require('./apis/sshKeys.json'),
        handlers: './handlers/sshKeys',
      }
    ],
    outputvalidation: app.settings.env === 'development'
});
app.get('/', function(req, res){
  fs.readFile('./dist/index.html', 'utf8', function(err, data){
    if(err){
      res.status(500).send(err);
    } else {
      res.status(200).send(data.replace('{{initAddr}}', env.COREOS_IPXE_SERVER_LISTEN_ADDR));
    }
  });
});

app.use(express.static('./dist'));
app.use('/images', express.static(path.join(env.COREOS_IPXE_SERVER_DATA_DIR, 'images')));
app.use(require('body-parser').text());
app.use(require('body-parser').json());
app.use(cors());
app.use(swagger);

server.listen(env.COREOS_IPXE_SERVER_LISTEN_ADDR.split(':')[1], env.COREOS_IPXE_SERVER_LISTEN_ADDR.split(':')[0], function () {
  console.log("Server listening on port " + server.address().port);
});
