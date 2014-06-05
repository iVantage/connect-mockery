/*global describe, beforeEach, it */
'use strict';

var mockery = require('../index.js')
  , expect = require('chai').expect;

/*
 * http://chaijs.com/api/bdd/
 */

describe('awesome', function() {
  
  beforeEach(function() {
    // setup here
  });

  describe('no args', function() {
    it('should be awesome', function() {
      expect(mockery.awesome()).to.equal('awesome');
    });
  });

});
