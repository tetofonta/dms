const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const path = require('path');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3500',
      changeOrigin: true,
    })
  );

  app.use('/plugins', express.static(path.join(__dirname, "..", "plugins", "build")))
};