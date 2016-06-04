'use strict';

var path = require('path');
var BinWrapper = require('bin-wrapper');

module.exports = new BinWrapper({strip: 0})
  .src('http://localhost:8008/api/v1/amd64/darwin/fly', 'darwin', 'x64')
  .src('http://localhost:8008/api/v1/amd64/windows/fly', 'win32', 'x64')
  .src('http://localhost:8008/api/v1/amd64/linux/fly', 'linux', 'x64')
	.dest(path.join(__dirname, 'vendor'))
	.use('fly');
