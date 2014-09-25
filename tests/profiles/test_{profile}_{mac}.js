'use strict';

var test = require('tape'),
    path = require('path'),
    express = require('express'),
    swaggerize = require('swaggerize-express'),
    request = require('supertest');

test('api', function (t) {
    var app = express();
    
    app.use(require('body-parser')());

    app.use(swaggerize({
        api: require('../../apis/profiles.json'),
        handlers: path.join(__dirname, '../../handlers/profiles'),
    }));

    
    t.test('test GET /{profile}/{mac}', function (t) {
        
        t.plan(2);

        request(app).get('/profiles/helloworld/{mac}')
        .expect(200)
        .end(function (err, res) {
            t.ok(!err, 'get /{profile}/{mac} no error.');
            t.strictEqual(res.statusCode, 200, 'get /{profile}/{mac} 200 status.');
        });
    });
    
    t.test('test PUT /{profile}/{mac}', function (t) {
        var body = {"cloud_config":"helloworld","version":"helloworld","sshkey":"helloworld","rootfstype":"helloworld","coreos_autologin":"helloworld"};
        t.plan(2);

        request(app).put('/profiles/helloworld/{mac}')
        .expect(200).send(body)
        .end(function (err, res) {
            t.ok(!err, 'put /{profile}/{mac} no error.');
            t.strictEqual(res.statusCode, 200, 'put /{profile}/{mac} 200 status.');
        });
    });
    

});
