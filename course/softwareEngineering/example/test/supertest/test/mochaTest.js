describe('GET /user', function() {
    const request = require('supertest');
    const express = require('express');
    const app = express();
    app.get('/user', function(req, res) {
        res.status(200).json({ name: 'tobi' });
    });
    it('respond with json', function(done) {
      request(app)
        .get('/user')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });