/*!
 * bufio.js - buffer utilities for javascript
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

const encoding = require('./encoding');
const BufferReader = require('./reader');
const BufferWriter = require('./writer');
const StaticWriter = require('./staticwriter');
const SizeWriter = require('./sizewriter');
const HashWriter = require('./hashwriter');

Object.setPrototypeOf(exports, encoding);

exports.bufio = exports;
exports.encoding = encoding;

exports.BufferReader = BufferReader;
exports.reader = (data, zeroCopy) => new BufferReader(data, zeroCopy);

exports.BufferWriter = BufferWriter;
exports.writer = () => new BufferWriter();

exports.StaticWriter = StaticWriter;
exports.static = (size) => new StaticWriter(size);
exports.pool = (size) => StaticWriter.pool(size);

exports.SizeWriter = SizeWriter;
exports.size = (size) => new SizeWriter(size);

exports.HashWriter = HashWriter;
exports.hash = (Hash, ...args) => new HashWriter(Hash, ...args);
