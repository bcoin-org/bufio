/*!
 * staticwriter.js - buffer writer for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

const assert = require('assert');
const encoding = require('./encoding');

/*
 * Constants
 */

const POOL0 = Buffer.allocUnsafe(0);
const POOL8 = Buffer.allocUnsafe(1);
const POOL16 = Buffer.allocUnsafe(2);
const POOL24 = Buffer.allocUnsafe(3);
const POOL32 = Buffer.allocUnsafe(4);
const POOL40 = Buffer.allocUnsafe(5);
const POOL48 = Buffer.allocUnsafe(6);
const POOL56 = Buffer.allocUnsafe(7);
const POOL64 = Buffer.allocUnsafe(8);
const POOL72 = Buffer.allocUnsafe(9);
const POOL256 = Buffer.allocUnsafe(32);

const poolBySize = [
  POOL0,
  POOL8,
  POOL16,
  POOL24,
  POOL32,
  POOL40,
  POOL48,
  POOL56,
  POOL64,
  POOL72
];

/**
 * Hash Writer
 */

class HashWriter {
  /**
   * Create a hash writer.
   * @constructor
   * @param {Object} ctx
   */

  constructor(ctx) {
    assert(ctx);
    this.ctx = ctx;
  }

  /**
   * Initialize the hash context.
   * @param {...Object} args
   */

  init(...args) {
    return this.ctx.init(...args);
  }

  /**
   * Update the hash context.
   * @param {Buffer} data
   */

  update(data) {
    return this.ctx.update(data);
  }

  /**
   * Render the final hash.
   * @returns {Buffer}
   */

  final() {
    if (this.ctx.digest)
      return this.ctx.digest();
    return this.ctx.final();
  }

  /**
   * Render the final hash.
   * @returns {Buffer}
   */

  render() {
    return this.final();
  }

  /**
   * Get size of data written so far.
   * @returns {Number}
   */

  getSize() {
    throw new Error('Not available.');
  }

  /**
   * Seek to relative offset.
   * @param {Number} offset
   */

  seek(offset) {
    throw new Error('Not available.');
  }

  /**
   * Destroy the buffer writer.
   */

  destroy() {
    throw new Error('Not available.');
  }

  /**
   * Write uint8.
   * @param {Number} value
   */

  writeU8(value) {
    POOL8.writeUInt8(value, 0, true);
    this.ctx.update(POOL8);
    return this;
  }

  /**
   * Write uint16le.
   * @param {Number} value
   */

  writeU16(value) {
    POOL16.writeUInt16LE(value, 0, true);
    this.ctx.update(POOL16);
    return this;
  }

  /**
   * Write uint16be.
   * @param {Number} value
   */

  writeU16BE(value) {
    POOL16.writeUInt16BE(value, 0, true);
    this.ctx.update(POOL16);
    return this;
  }

  /**
   * Write uint32le.
   * @param {Number} value
   */

  writeU32(value) {
    POOL32.writeUInt32LE(value, 0, true);
    this.ctx.update(POOL32);
    return this;
  }

  /**
   * Write uint32be.
   * @param {Number} value
   */

  writeU32BE(value) {
    POOL32.writeUInt32BE(value, 0, true);
    this.ctx.update(POOL32);
    return this;
  }

  /**
   * Write uint64le.
   * @param {Number} value
   */

  writeU64(value) {
    encoding.writeU64(POOL64, value, 0);
    this.ctx.update(POOL64);
    return this;
  }

  /**
   * Write uint64be.
   * @param {Number} value
   */

  writeU64BE(value) {
    encoding.writeU64BE(POOL64, value, 0);
    this.ctx.update(POOL64);
    return this;
  }

  /**
   * Write uint64le.
   * @param {U64} value
   */

  writeU64N(value) {
    encoding.writeU64N(POOL64, value, 0);
    this.ctx.update(POOL64);
    return this;
  }

  /**
   * Write uint64be.
   * @param {U64} value
   */

  writeU64BEN(value) {
    encoding.writeU64BEN(POOL64, value, 0);
    this.ctx.update(POOL64);
    return this;
  }

  /**
   * Write int8.
   * @param {Number} value
   */

  writeI8(value) {
    POOL8.writeInt8(value, 0, true);
    this.ctx.update(POOL8);
    return this;
  }

  /**
   * Write int16le.
   * @param {Number} value
   */

  writeI16(value) {
    POOL16.writeInt16LE(value, 0, true);
    this.ctx.update(POOL16);
    return this;
  }

  /**
   * Write int16be.
   * @param {Number} value
   */

  writeI16BE(value) {
    POOL16.writeInt16BE(value, 0, true);
    this.ctx.update(POOL16);
    return this;
  }

  /**
   * Write int32le.
   * @param {Number} value
   */

  writeI32(value) {
    POOL32.writeInt32LE(value, 0, true);
    this.ctx.update(POOL32);
    return this;
  }

  /**
   * Write int32be.
   * @param {Number} value
   */

  writeI32BE(value) {
    POOL32.writeInt32BE(value, 0, true);
    this.ctx.update(POOL32);
    return this;
  }

  /**
   * Write int64le.
   * @param {Number} value
   */

  writeI64(value) {
    encoding.writeI64(POOL64, value, 0);
    this.ctx.update(POOL64);
    return this;
  }

  /**
   * Write int64be.
   * @param {Number} value
   */

  writeI64BE(value) {
    encoding.writeI64BE(POOL64, value, 0);
    this.ctx.update(POOL64);
    return this;
  }

  /**
   * Write int64le.
   * @param {I64} value
   */

  writeI64N(value) {
    encoding.writeI64N(POOL64, value, 0);
    this.ctx.update(POOL64);
    return this;
  }

  /**
   * Write int64be.
   * @param {I64} value
   */

  writeI64BEN(value) {
    encoding.writeI64BEN(POOL64, value, 0);
    this.ctx.update(POOL64);
    return this;
  }

  /**
   * Write float le.
   * @param {Number} value
   */

  writeFloat(value) {
    POOL32.writeFloatLE(value, 0, true);
    this.ctx.update(POOL32);
    return this;
  }

  /**
   * Write float be.
   * @param {Number} value
   */

  writeFloatBE(value) {
    POOL32.writeFloatBE(value, 0, true);
    this.ctx.update(POOL32);
    return this;
  }

  /**
   * Write double le.
   * @param {Number} value
   */

  writeDouble(value) {
    POOL64.writeDoubleLE(value, 0, true);
    this.ctx.update(POOL64);
    return this;
  }

  /**
   * Write double be.
   * @param {Number} value
   */

  writeDoubleBE(value) {
    POOL64.writeDoubleBE(value, 0, true);
    this.ctx.update(POOL64);
    return this;
  }

  /**
   * Write a varint.
   * @param {Number} value
   */

  writeVarint(value) {
    const size = encoding.sizeVarint(value);
    const pool = poolBySize[size];
    encoding.writeVarint(pool, value, 0);
    this.ctx.update(pool);
    return this;
  }

  /**
   * Write a varint.
   * @param {U64} value
   */

  writeVarintN(value) {
    const size = encoding.sizeVarintN(value);
    const pool = poolBySize[size];
    encoding.writeVarintN(pool, value, 0);
    this.ctx.update(pool);
    return this;
  }

  /**
   * Write a varint (type 2).
   * @param {Number} value
   */

  writeVarint2(value) {
    const size = encoding.sizeVarint2(value);
    const pool = poolBySize[size];
    encoding.writeVarint2(pool, value, 0);
    this.ctx.update(pool);
    return this;
  }

  /**
   * Write a varint (type 2).
   * @param {U64} value
   */

  writeVarint2N(value) {
    const size = encoding.sizeVarint2N(value);
    const pool = poolBySize[size];
    encoding.writeVarint2N(pool, value, 0);
    this.ctx.update(pool);
    return this;
  }

  /**
   * Write bytes.
   * @param {Buffer} value
   */

  writeBytes(value) {
    this.ctx.update(value);
    return this;
  }

  /**
   * Write bytes with a varint length before them.
   * @param {Buffer} value
   */

  writeVarBytes(value) {
    this.writeVarint(value.length);
    this.writeBytes(value);
    return this;
  }

  /**
   * Copy bytes.
   * @param {Buffer} value
   * @param {Number} start
   * @param {Number} end
   */

  copy(value, start, end) {
    this.ctx.update(value.slice(start, end));
    return this;
  }

  /**
   * Write string to buffer.
   * @param {String} value
   * @param {String?} enc - Any buffer-supported encoding.
   */

  writeString(value, enc) {
    if (value.length === 0)
      return this;

    if (typeof value === 'string')
      value = Buffer.from(value, enc);

    this.ctx.update(value);
    return this;
  }

  /**
   * Write a 32 byte hash.
   * @param {Hash} value
   */

  writeHash(value) {
    if (typeof value !== 'string') {
      assert(value.length === 32);
      this.writeBytes(value);
      return this;
    }
    assert(value.length === 64);
    POOL256.write(value, 0, 'hex');
    this.ctx.update(POOL256);
    return this;
  }

  /**
   * Write a string with a varint length before it.
   * @param {String}
   * @param {String?} enc - Any buffer-supported encoding.
   */

  writeVarString(value, enc) {
    if (value.length === 0) {
      this.writeVarint(0);
      return this;
    }

    const size = Buffer.byteLength(value, enc);

    this.writeVarint(size);
    this.ctx.update(value, enc);

    return this;
  }

  /**
   * Write a null-terminated string.
   * @param {String|Buffer}
   * @param {String?} enc - Any buffer-supported encoding.
   */

  writeNullString(value, enc) {
    this.writeString(value, enc);
    this.writeU8(0);
    return this;
  }

  /**
   * Calculate and write a checksum for the data written so far.
   */

  writeChecksum() {
    throw new Error('Not available.');
  }

  /**
   * Fill N bytes with value.
   * @param {Number} value
   * @param {Number} size
   */

  fill(value, size) {
    assert(size >= 0);

    if (size === 0)
      return this;

    if (size <= 32) {
      const data = POOL256.slice(0, size);
      data.fill(value);
      this.ctx.update(data);
      return this;
    }

    const data = Buffer.allocUnsafe(size);
    data.fill(value);

    this.ctx.update(data);

    return this;
  }
}

/*
 * Expose
 */

module.exports = HashWriter;
