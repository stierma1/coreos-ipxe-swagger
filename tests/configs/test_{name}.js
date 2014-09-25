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
        api: require('../../apis/configs.json'),
        handlers: path.join(__dirname, '../../handlers/configs'),
    }));

    
    t.test('test GET /{name}', function (t) {
        
        t.plan(2);

        request(app).get('/configs/helloworld')
        .expect(200)
        .end(function (err, res) {
            t.ok(!err, 'get /{name} no error.');
            t.strictEqual(res.statusCode, 200, 'get /{name} 200 status.');
        });
    });
    
    t.test('test PUT /{name}', function (t) {
        var body = ;
        t.plan(2);

        request(app).put('/configs/helloworld')
        .expect(200).send(body)
        .end(function (err, res) {
            t.ok(!err, 'put /{name} no error.');
            t.strictEqual(res.statusCode, 200, 'put /{name} 200 status.');
        });
    });
    

});
