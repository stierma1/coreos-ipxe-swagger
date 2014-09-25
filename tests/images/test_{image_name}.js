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
        api: require('../../apis/images.json'),
        handlers: path.join(__dirname, '../../handlers/images'),
    }));

    
    t.test('test GET /{image_name}', function (t) {
        
        t.plan(2);

        request(app).get('/images/helloworld')
        .expect(200)
        .end(function (err, res) {
            t.ok(!err, 'get /{image_name} no error.');
            t.strictEqual(res.statusCode, 200, 'get /{image_name} 200 status.');
        });
    });
    
    t.test('test PUT /{image_name}', function (t) {
        var body = ;
        t.plan(2);

        request(app).put('/images/helloworld')
        .expect(200).send(body)
        .end(function (err, res) {
            t.ok(!err, 'put /{image_name} no error.');
            t.strictEqual(res.statusCode, 200, 'put /{image_name} 200 status.');
        });
    });
    

});
