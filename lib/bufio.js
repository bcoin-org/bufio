/*!
 * bufio.js - buffer utilities for javascript
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

const encoding = require('./encoding');
const EncodingError = require('./error');
const BufferReader = require('./reader');
const BufferWriter = require('./writer');
const StaticWriter = require('./staticwriter');
const SizeWriter = require('./sizewriter');
const HashWriter = require('./hashwriter');
const Struct = require('./struct');

exports.encoding = encoding;
exports.EncodingError = EncodingError;
exports.BufferReader = BufferReader;
exports.BufferWriter = BufferWriter;
exports.StaticWriter = StaticWriter;
exports.SizeWriter = SizeWriter;
exports.HashWriter = HashWriter;
exports.Struct = Struct;

exports.read = function read(data, zeroCopy) {
  return new BufferReader(data, zeroCopy);
};

exports.write = function write(size) {
  return size != null
    ? new StaticWriter(size)
    : new BufferWriter();
};

exports.pool = function pool(size) {
  return StaticWriter.pool(size);
};

exports.size = function size(_size) {
  return new SizeWriter(_size);
};

exports.hash = function hash(ctx) {
  return new HashWriter(ctx);
};
