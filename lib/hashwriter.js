/*!
 * staticwriter.js - buffer writer for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

const enforce = require('./enforce');
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
    enforce(ctx && typeof ctx.update === 'function', 'ctx', 'hash context');
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
    encoding.writeU8(POOL8, value, 0);
    this.ctx.update(POOL8);
    return this;
  }

  /**
   * Write uint16le.
   * @param {Number} value
   */

  writeU16(value) {
    encoding.writeU16(POOL16, value, 0);
    this.ctx.update(POOL16);
    return this;
  }

  /**
   * Write uint16be.
   * @param {Number} value
   */

  writeU16BE(value) {
    encoding.writeU16BE(POOL16, value, 0);
    this.ctx.update(POOL16);
    return this;
  }

  /**
   * Write uint24le.
   * @param {Number} value
   */

  writeU24(value) {
    encoding.writeU24(POOL24, value, 0);
    this.ctx.update(POOL24);
    return this;
  }

  /**
   * Write uint24be.
   * @param {Number} value
   */

  writeU24BE(value) {
    encoding.writeU24BE(POOL24, value, 0);
    this.ctx.update(POOL24);
    return this;
  }

  /**
   * Write uint32le.
   * @param {Number} value
   */

  writeU32(value) {
    encoding.writeU32(POOL32, value, 0);
    this.ctx.update(POOL32);
    return this;
  }

  /**
   * Write uint32be.
   * @param {Number} value
   */

  writeU32BE(value) {
    encoding.writeU32BE(POOL32, value, 0);
    this.ctx.update(POOL32);
    return this;
  }

  /**
   * Write uint40le.
   * @param {Number} value
   */

  writeU40(value) {
    encoding.writeU40(POOL40, value, 0);
    this.ctx.update(POOL40);
    return this;
  }

  /**
   * Write uint40be.
   * @param {Number} value
   */

  writeU40BE(value) {
    encoding.writeU40BE(POOL40, value, 0);
    this.ctx.update(POOL40);
    return this;
  }

  /**
   * Write uint48le.
   * @param {Number} value
   */

  writeU48(value) {
    encoding.writeU48(POOL48, value, 0);
    this.ctx.update(POOL48);
    return this;
  }

  /**
   * Write uint48be.
   * @param {Number} value
   */

  writeU48BE(value) {
    encoding.writeU48BE(POOL48, value, 0);
    this.ctx.update(POOL48);
    return this;
  }

  /**
   * Write uint56le.
   * @param {Number} value
   */

  writeU56(value) {
    encoding.writeU56(POOL56, value, 0);
    this.ctx.update(POOL56);
    return this;
  }

  /**
   * Write uint56be.
   * @param {Number} value
   */

  writeU56BE(value) {
    encoding.writeU56BE(POOL56, value, 0);
    this.ctx.update(POOL56);
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
   * Write int8.
   * @param {Number} value
   */

  writeI8(value) {
    encoding.writeI8(POOL8, value, 0);
    this.ctx.update(POOL8);
    return this;
  }

  /**
   * Write int16le.
   * @param {Number} value
   */

  writeI16(value) {
    encoding.writeI16(POOL16, value, 0);
    this.ctx.update(POOL16);
    return this;
  }

  /**
   * Write int16be.
   * @param {Number} value
   */

  writeI16BE(value) {
    encoding.writeI16BE(POOL16, value, 0);
    this.ctx.update(POOL16);
    return this;
  }

  /**
   * Write int24le.
   * @param {Number} value
   */

  writeI24(value) {
    encoding.writeI24(POOL24, value, 0);
    this.ctx.update(POOL24);
    return this;
  }

  /**
   * Write int24be.
   * @param {Number} value
   */

  writeI24BE(value) {
    encoding.writeI24BE(POOL24, value, 0);
    this.ctx.update(POOL24);
    return this;
  }

  /**
   * Write int32le.
   * @param {Number} value
   */

  writeI32(value) {
    encoding.writeI32(POOL32, value, 0);
    this.ctx.update(POOL32);
    return this;
  }

  /**
   * Write int32be.
   * @param {Number} value
   */

  writeI32BE(value) {
    encoding.writeI32BE(POOL32, value, 0);
    this.ctx.update(POOL32);
    return this;
  }

  /**
   * Write int40le.
   * @param {Number} value
   */

  writeI40(value) {
    encoding.writeI40(POOL40, value, 0);
    this.ctx.update(POOL40);
    return this;
  }

  /**
   * Write int40be.
   * @param {Number} value
   */

  writeI40BE(value) {
    encoding.writeI40BE(POOL40, value, 0);
    this.ctx.update(POOL40);
    return this;
  }

  /**
   * Write int48le.
   * @param {Number} value
   */

  writeI48(value) {
    encoding.writeI48(POOL48, value, 0);
    this.ctx.update(POOL48);
    return this;
  }

  /**
   * Write int48be.
   * @param {Number} value
   */

  writeI48BE(value) {
    encoding.writeI48BE(POOL48, value, 0);
    this.ctx.update(POOL48);
    return this;
  }

  /**
   * Write int56le.
   * @param {Number} value
   */

  writeI56(value) {
    encoding.writeI56(POOL56, value, 0);
    this.ctx.update(POOL56);
    return this;
  }

  /**
   * Write int56be.
   * @param {Number} value
   */

  writeI56BE(value) {
    encoding.writeI56BE(POOL56, value, 0);
    this.ctx.update(POOL56);
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
   * Write float le.
   * @param {Number} value
   */

  writeFloat(value) {
    encoding.writeFloat(POOL32, value, 0);
    this.ctx.update(POOL32);
    return this;
  }

  /**
   * Write float be.
   * @param {Number} value
   */

  writeFloatBE(value) {
    encoding.writeFloatBE(POOL32, value, 0);
    this.ctx.update(POOL32);
    return this;
  }

  /**
   * Write double le.
   * @param {Number} value
   */

  writeDouble(value) {
    encoding.writeDouble(POOL64, value, 0);
    this.ctx.update(POOL64);
    return this;
  }

  /**
   * Write double be.
   * @param {Number} value
   */

  writeDoubleBE(value) {
    encoding.writeDoubleBE(POOL64, value, 0);
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
    enforce(Buffer.isBuffer(value), 'value', 'buffer');
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
    enforce(Buffer.isBuffer(value), 'value', 'buffer');
    enforce((start >>> 0) === start, 'start', 'integer');
    enforce((end >>> 0) === end, 'end', 'integer');
    enforce(end >= start, 'start', 'integer');
    this.ctx.update(value.slice(start, end));
    return this;
  }

  /**
   * Write string to buffer.
   * @param {String} value
   * @param {String?} enc - Any buffer-supported encoding.
   */

  writeString(value, enc) {
    if (enc == null)
      enc = 'binary';

    enforce(typeof value === 'string', 'value', 'string');
    enforce(typeof enc === 'string', 'enc', 'string');

    this.ctx.update(Buffer.from(value, enc));

    return this;
  }

  /**
   * Write a 32 byte hash.
   * @param {Hash} value
   */

  writeHash(value) {
    if (typeof value !== 'string') {
      enforce(Buffer.isBuffer(value), 'value', 'buffer');
      enforce(value.length === 32, 'value', '32-byte hash');
      this.writeBytes(value);
      return this;
    }
    enforce(POOL256.write(value, 0, 'hex') === 32, 'value', '32-byte hash');
    this.ctx.update(POOL256);
    return this;
  }

  /**
   * Write a string with a varint length before it.
   * @param {String}
   * @param {String?} enc - Any buffer-supported encoding.
   */

  writeVarString(value, enc) {
    if (enc == null)
      enc = 'binary';

    enforce(typeof value === 'string', 'value', 'string');
    enforce(typeof enc === 'string', 'enc', 'string');

    if (value.length === 0) {
      this.writeVarint(0);
      return this;
    }

    const buf = Buffer.from(value, enc);

    this.writeVarint(buf.length);
    this.ctx.update(buf);

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
    enforce((value & 0xff) === value, 'value', 'byte');
    enforce((size >>> 0) === size, 'size', 'integer');

    if (size === 0)
      return this;

    if (size <= 32) {
      const data = POOL256.slice(0, size);
      data.fill(value, 0, size);
      this.ctx.update(data);
      return this;
    }

    const data = Buffer.allocUnsafe(size);

    data.fill(value, 0, size);

    this.ctx.update(data);

    return this;
  }
}

/*
 * Expose
 */

module.exports = HashWriter;
