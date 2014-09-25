var http = require('http');
var express = require('express');
var swaggerize = require('swaggerize-express');
var cors = require('cors');
var fs = require('fs');
var path = require('path');

var env = {
  baseUrl :  (process.env.COREOS_IPXE_SERVER_BASE_URL || '127.0.0.1:4777'),
  dataDirectory : (process.env.COREOS_IPXE_SERVER_DATA_DIR || "/opt/coreos-ipxe-server"),
  listenAddr : (process.env.COREOS_IPXE_SERVER_LISTEN_ADDR || "127.0.0.1:4777")
};

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
      res.status(200).send(data.replace('{{initAddr}}', env.listenAddr));
    }
  });
});

app.use(express.static('./dist'));
app.use('/images', express.static(path.join(env.dataDirectory, 'images')));
app.use(require('body-parser').text());
app.use(require('body-parser').json());
app.use(cors());
app.use(swagger);

server.listen(env.listenAddr.split(':')[1], env.listenAddr.split(':')[0], function () {
  console.log("Server listening on port " + server.address().port);
});
