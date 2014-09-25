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
        api: require('../../apis/sshKeys.json'),
        handlers: path.join(__dirname, '../../handlers/sshKeys'),
    }));

    
    t.test('test GET /{key_name}', function (t) {
        
        t.plan(2);

        request(app).get('/sshKeys/helloworld')
        .expect(200)
        .end(function (err, res) {
            t.ok(!err, 'get /{key_name} no error.');
            t.strictEqual(res.statusCode, 200, 'get /{key_name} 200 status.');
        });
    });
    
    t.test('test PUT /{key_name}', function (t) {
        var body = ;
        t.plan(2);

        request(app).put('/sshKeys/helloworld')
        .expect(200).send(body)
        .end(function (err, res) {
            t.ok(!err, 'put /{key_name} no error.');
            t.strictEqual(res.statusCode, 200, 'put /{key_name} 200 status.');
        });
    });
    

});
