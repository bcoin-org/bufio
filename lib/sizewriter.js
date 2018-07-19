/*!
 * sizewriter.js - buffer writer for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

const enforce = require('./enforce');
const encoding = require('./encoding');
const EncodingError = require('./error');

/**
 * Size Writer
 */

class SizeWriter {
  /**
   * Create a size writer.
   * @constructor
   */

  constructor() {
    this.offset = 0;
  }

  /**
   * Calculate size.
   * @returns {Number}
   */

  render() {
    const size = this.offset;
    this.destroy();
    return size;
  }

  /**
   * Get size of data written so far.
   * @returns {Number}
   */

  getSize() {
    return this.offset;
  }

  /**
   * Seek to relative offset.
   * @param {Number} offset
   */

  seek(off) {
    enforce(Number.isSafeInteger(off), 'off', 'integer');

    if (this.offset + off < 0)
      throw new EncodingError(this.offset, 'Out of bounds write');

    this.offset += off;

    return this;
  }

  /**
   * Destroy the buffer writer.
   */

  destroy() {
    this.offset = 0;
    return this;
  }

  /**
   * Write uint8.
   * @param {Number} value
   */

  writeU8(value) {
    this.offset += 1;
    return this;
  }

  /**
   * Write uint16le.
   * @param {Number} value
   */

  writeU16(value) {
    this.offset += 2;
    return this;
  }

  /**
   * Write uint16be.
   * @param {Number} value
   */

  writeU16BE(value) {
    this.offset += 2;
    return this;
  }

  /**
   * Write uint24le.
   * @param {Number} value
   */

  writeU24(value) {
    this.offset += 3;
    return this;
  }

  /**
   * Write uint24be.
   * @param {Number} value
   */

  writeU24BE(value) {
    this.offset += 3;
    return this;
  }

  /**
   * Write uint32le.
   * @param {Number} value
   */

  writeU32(value) {
    this.offset += 4;
    return this;
  }

  /**
   * Write uint32be.
   * @param {Number} value
   */

  writeU32BE(value) {
    this.offset += 4;
    return this;
  }

  /**
   * Write uint40le.
   * @param {Number} value
   */

  writeU40(value) {
    this.offset += 5;
    return this;
  }

  /**
   * Write uint40be.
   * @param {Number} value
   */

  writeU40BE(value) {
    this.offset += 5;
    return this;
  }

  /**
   * Write uint48le.
   * @param {Number} value
   */

  writeU48(value) {
    this.offset += 6;
    return this;
  }

  /**
   * Write uint48be.
   * @param {Number} value
   */

  writeU48BE(value) {
    this.offset += 6;
    return this;
  }

  /**
   * Write uint56le.
   * @param {Number} value
   */

  writeU56(value) {
    this.offset += 7;
    return this;
  }

  /**
   * Write uint56be.
   * @param {Number} value
   */

  writeU56BE(value) {
    this.offset += 7;
    return this;
  }

  /**
   * Write uint64le.
   * @param {Number} value
   */

  writeU64(value) {
    this.offset += 8;
    return this;
  }

  /**
   * Write uint64be.
   * @param {Number} value
   */

  writeU64BE(value) {
    this.offset += 8;
    return this;
  }

  /**
   * Write int8.
   * @param {Number} value
   */

  writeI8(value) {
    this.offset += 1;
    return this;
  }

  /**
   * Write int16le.
   * @param {Number} value
   */

  writeI16(value) {
    this.offset += 2;
    return this;
  }

  /**
   * Write int16be.
   * @param {Number} value
   */

  writeI16BE(value) {
    this.offset += 2;
    return this;
  }

  /**
   * Write int24le.
   * @param {Number} value
   */

  writeI24(value) {
    this.offset += 3;
    return this;
  }

  /**
   * Write int24be.
   * @param {Number} value
   */

  writeI24BE(value) {
    this.offset += 3;
    return this;
  }

  /**
   * Write int32le.
   * @param {Number} value
   */

  writeI32(value) {
    this.offset += 4;
    return this;
  }

  /**
   * Write int32be.
   * @param {Number} value
   */

  writeI32BE(value) {
    this.offset += 4;
    return this;
  }

  /**
   * Write int40le.
   * @param {Number} value
   */

  writeI40(value) {
    this.offset += 5;
    return this;
  }

  /**
   * Write int40be.
   * @param {Number} value
   */

  writeI40BE(value) {
    this.offset += 5;
    return this;
  }

  /**
   * Write int48le.
   * @param {Number} value
   */

  writeI48(value) {
    this.offset += 6;
    return this;
  }

  /**
   * Write int48be.
   * @param {Number} value
   */

  writeI48BE(value) {
    this.offset += 6;
    return this;
  }

  /**
   * Write int56le.
   * @param {Number} value
   */

  writeI56(value) {
    this.offset += 7;
    return this;
  }

  /**
   * Write int56be.
   * @param {Number} value
   */

  writeI56BE(value) {
    this.offset += 7;
    return this;
  }

  /**
   * Write int64le.
   * @param {Number} value
   */

  writeI64(value) {
    this.offset += 8;
    return this;
  }

  /**
   * Write int64be.
   * @param {Number} value
   */

  writeI64BE(value) {
    this.offset += 8;
    return this;
  }

  /**
   * Write float le.
   * @param {Number} value
   */

  writeFloat(value) {
    this.offset += 4;
    return this;
  }

  /**
   * Write float be.
   * @param {Number} value
   */

  writeFloatBE(value) {
    this.offset += 4;
    return this;
  }

  /**
   * Write double le.
   * @param {Number} value
   */

  writeDouble(value) {
    this.offset += 8;
    return this;
  }

  /**
   * Write double be.
   * @param {Number} value
   */

  writeDoubleBE(value) {
    this.offset += 8;
    return this;
  }

  /**
   * Write a varint.
   * @param {Number} value
   */

  writeVarint(value) {
    this.offset += encoding.sizeVarint(value);
    return this;
  }

  /**
   * Write a varint (type 2).
   * @param {Number} value
   */

  writeVarint2(value) {
    this.offset += encoding.sizeVarint2(value);
    return this;
  }

  /**
   * Write bytes.
   * @param {Buffer} value
   */

  writeBytes(value) {
    enforce(Buffer.isBuffer(value), 'value', 'buffer');
    this.offset += value.length;
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
    this.offset += end - start;
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

    if (value.length === 0)
      return this;

    this.offset += Buffer.byteLength(value, enc);

    return this;
  }

  /**
   * Write a 32 byte hash.
   * @param {Hash} value
   */

  writeHash(value) {
    this.offset += 32;
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
      this.offset += 1;
      return this;
    }

    const size = Buffer.byteLength(value, enc);

    this.writeVarint(size);

    this.offset += size;

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
   * @param {Function} hash
   */

  writeChecksum(hash) {
    this.offset += 4;
    return this;
  }

  /**
   * Fill N bytes with value.
   * @param {Number} value
   * @param {Number} size
   */

  fill(value, size) {
    enforce((size >>> 0) === size, 'size', 'integer');
    this.offset += size;
    return this;
  }
}

/*
 * Expose
 */

module.exports = SizeWriter;
