
module.exports = function(opts) {
  'use strict';
  opts = opts || {};

  var fs = require('fs')
    , j = require('path').join;

  var resMap = {};

  var cleanCacheOnRefresh = opts.cleanCacheOnRefresh || true
    , appBase = opts.appBase = j(process.cwd(), 'app')
    , mockBase = opts.mockBase || '/mock';

  var filesOnly = function(dir, paths, cb) {
    // Asynchronously filter down a bunch of paths to just files (i.e. no
    // directories)... we can't stream a directory :p
    var numToCheck = paths.length
      , checksMade = 0
      , files = [];

    if(!numToCheck) { return cb(null, files); }

    var done = function() {
      checksMade++;
      if(numToCheck === checksMade) {
        cb(null, files);
      }
    };

    paths.forEach(function(p) {
      var fullP = j(dir, p);
      fs.stat(fullP, function(err, stats) {
        if(!err && stats.isFile()) {
          files.push(p);
        }
        done();
      });
    });
  };

  return function(req, res, next) {
    if('/' === req.url && cleanCacheOnRefresh) {
      resMap = {};
    }

    if(req.url.indexOf(mockBase) !== 0) {
      // Pass through if this is not a request for mock data
      return next();
    }

    var dir = j(appBase, req.url.replace(/[?#].*/,''));

    fs.readdir(dir, function(err, paths) {
      if(err || !paths.length) { return next(); }
      filesOnly(dir, paths, function(error, files) {
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
    });
  };
};
