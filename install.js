'use strict';

var log = require('logalot');
var bin = require('./');

// launch proxy server
//-- /api/v1/{:arch}/{:platform} -> /api/v1/cli?arch={:arch}&platform={:platform}
//-- The name of the file to download of BinWrapper is to basename of URL.
//-- But to alter the basename in the proxy because it does not fly of the work well in the URL.
var http = require('http');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var server = http.createServer(function (req, res) {
  var match = req.url.match(/^\/api\/v1\/(.*?)\/(.*?)\/fly$/);
  if (!match) {
    throw new Error(`unsupport url: ${req.url}`);
  }
  // proxy request
  var arch = match[1];
  var platform = match[2];
  var hostname = 'ci.concourse.ci';
  var protocol = 'https';
  var path = `/api/v1/cli?arch=${arch}&platform=${platform}`;
  var url = protocol + '://' + hostname + path || '/';
  var origin = protocol + '://' + hostname + '/';
  req.url = url;
  req.originalUrl = url;
  req.headers['host'] = hostname;
	proxy.proxyRequest(req, res, {target: origin});

}).listen(8008);

// run install
bin.run(['--version'], function (err) {
	server.close();

	if (err) {
		log.error(err.message);
		log.error('fly binary test failed');
		return;
	}

	log.success('fly binary test passed successfully');
});
