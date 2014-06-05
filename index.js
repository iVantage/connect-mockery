
module.exports = function(opts) {
  'use strict';
  opts = opts || {};

  var j = require('path').join;

  var resMap = {};

  var cleanCacheOnRefresh = opts.cleanCacheOnRefresh || true
    , appBase = opts.appBase = j(process.cwd(), 'app')
    , mockBase = opts.mockBase || '/mock';

  return function(req, res, next) {
    if('/' === req.url && cleanCacheOnRefresh) {
      resMap = {};
    }

    if(req.url.indexOf(mockBase) !== 0) {
      // Pass through if this is not a request for mock data
      return next();
    }

    var fs = require('fs')
      , j = require('path').join
      , dir = j(appBase, req.url.replace(/[?#].*/,''));
    fs.readdir(dir, function(err, files) {
      if(err || !files.length) { return next(); }
      files.sort();
      var f, fIx;
      if(resMap[dir]) {
        fIx = files.indexOf(resMap[dir]);
        f = files[(fIx + 1) % files.length];
      } else {
        f = files[0];
      }
      resMap[dir] = f;
      fs.createReadStream(j(dir, f)).pipe(res);
    });
  };
};
