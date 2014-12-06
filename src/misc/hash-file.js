/*
 * fs-helper.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var crypto = require('crypto'); 

// exports
module.exports = hashFile;

/**
 * [hashFile description]
 * 
 * @param  {[type]} fileContents [description]
 * 
 * @return {[type]}              [description]
 */
function hashFile(fileContents) {
  // change to 'md5' if you want an MD5 hash
  var hash = crypto.createHash('sha1');

  // change to 'binary' if you want a binary hash.
  hash.setEncoding('hex');

  // the text that you want to hash
  hash.write(fileContents);

  // very important! You cannot read from the stream until you haven't called end()
  hash.end();

  // and now you get the resulting hash
  return hash.read();
}