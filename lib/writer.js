/*!
 * writer.js - buffer writer for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

const assert = require('assert');
const encoding = require('./encoding');
const EncodingError = require('./error');

/*
 * Constants
 */

const SEEK = 0;
const U8 = 1;
const U16 = 2;
const U16BE = 3;
const U32 = 4;
const U32BE = 5;
const U64 = 6;
const U64BE = 7;
const I8 = 8;
const I16 = 9;
const I16BE = 10;
const I32 = 11;
const I32BE = 12;
const I64 = 13;
const I64BE = 14;
const FL = 15;
const FLBE = 16;
const DBL = 17;
const DBLBE = 18;
const VARINT = 19;
const VARINT2 = 20;
const BYTES = 21;
const STR = 22;
const CHECKSUM = 23;
const FILL = 24;

/**
 * Buffer Writer
 */

class BufferWriter {
  /**
   * Create a buffer writer.
   * @constructor
   */

  constructor() {
    this.ops = [];
    this.offset = 0;
  }

  /**
   * Allocate and render the final buffer.
   * @returns {Buffer} Rendered buffer.
   */

  render() {
    const data = Buffer.allocUnsafe(this.offset);

    let off = 0;

    for (const op of this.ops) {
      switch (op.type) {
        case SEEK:
          off += op.value;
          break;
        case U8:
          off = encoding.writeU8(data, op.value, off);
          break;
        case U16:
          off = encoding.writeU16(data, op.value, off);
          break;
        case U16BE:
          off = encoding.writeU16BE(data, op.value, off);
          break;
        case U32:
          off = encoding.writeU32(data, op.value, off);
          break;
        case U32BE:
          off = encoding.writeU32BE(data, op.value, off);
          break;
        case U64:
          off = encoding.writeU64(data, op.value, off);
          break;
        case U64BE:
          off = encoding.writeU64BE(data, op.value, off);
          break;
        case I8:
          off = encoding.writeI8(data, op.value, off);
          break;
        case I16:
          off = encoding.writeI16(data, op.value, off);
          break;
        case I16BE:
          off = encoding.writeI16BE(data, op.value, off);
          break;
        case I32:
          off = encoding.writeI32(data, op.value, off);
          break;
        case I32BE:
          off = encoding.writeI32BE(data, op.value, off);
          break;
        case I64:
          off = encoding.writeI64(data, op.value, off);
          break;
        case I64BE:
          off = encoding.writeI64BE(data, op.value, off);
          break;
        case FL:
          off = encoding.writeFloat(data, op.value, off);
          break;
        case FLBE:
          off = encoding.writeFloatBE(data, op.value, off);
          break;
        case DBL:
          off = encoding.writeDouble(data, op.value, off);
          break;
        case DBLBE:
          off = encoding.writeDoubleBE(data, op.value, off);
          break;
        case VARINT:
          off = encoding.writeVarint(data, op.value, off);
          break;
        case VARINT2:
          off = encoding.writeVarint2(data, op.value, off);
          break;
        case BYTES:
          off += op.data.copy(data, off);
          break;
        case STR:
          off += data.write(op.value, off, op.enc);
          break;
        case CHECKSUM:
          off += op.func(data.slice(0, off)).copy(data, off, 0, 4);
          break;
        case FILL:
          data.fill(op.value, off, off + op.size);
          off += op.size;
          break;
        default:
          assert(false, 'Bad type.');
          break;
      }
    }

    if (off !== data.length)
      throw new EncodingError(off, 'Out of bounds write');

    this.destroy();

    return data;
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

  seek(offset) {
    this.offset += offset;
    this.ops.push(new NumberOp(SEEK, offset));
    return this;
  }

  /**
   * Destroy the buffer writer. Remove references to `ops`.
   */

  destroy() {
    this.ops.length = 0;
    this.offset = 0;
    return this;
  }

  /**
   * Write uint8.
   * @param {Number} value
   */

  writeU8(value) {
    this.offset += 1;
    this.ops.push(new NumberOp(U8, value));
    return this;
  }

  /**
   * Write uint16le.
   * @param {Number} value
   */

  writeU16(value) {
    this.offset += 2;
    this.ops.push(new NumberOp(U16, value));
    return this;
  }

  /**
   * Write uint16be.
   * @param {Number} value
   */

  writeU16BE(value) {
    this.offset += 2;
    this.ops.push(new NumberOp(U16BE, value));
    return this;
  }

  /**
   * Write uint32le.
   * @param {Number} value
   */

  writeU32(value) {
    this.offset += 4;
    this.ops.push(new NumberOp(U32, value));
    return this;
  }

  /**
   * Write uint32be.
   * @param {Number} value
   */

  writeU32BE(value) {
    this.offset += 4;
    this.ops.push(new NumberOp(U32BE, value));
    return this;
  }

  /**
   * Write uint64le.
   * @param {Number} value
   */

  writeU64(value) {
    this.offset += 8;
    this.ops.push(new NumberOp(U64, value));
    return this;
  }

  /**
   * Write uint64be.
   * @param {Number} value
   */

  writeU64BE(value) {
    this.offset += 8;
    this.ops.push(new NumberOp(U64BE, value));
    return this;
  }

  /**
   * Write int8.
   * @param {Number} value
   */

  writeI8(value) {
    this.offset += 1;
    this.ops.push(new NumberOp(I8, value));
    return this;
  }

  /**
   * Write int16le.
   * @param {Number} value
   */

  writeI16(value) {
    this.offset += 2;
    this.ops.push(new NumberOp(I16, value));
    return this;
  }

  /**
   * Write int16be.
   * @param {Number} value
   */

  writeI16BE(value) {
    this.offset += 2;
    this.ops.push(new NumberOp(I16BE, value));
    return this;
  }

  /**
   * Write int32le.
   * @param {Number} value
   */

  writeI32(value) {
    this.offset += 4;
    this.ops.push(new NumberOp(I32, value));
    return this;
  }

  /**
   * Write int32be.
   * @param {Number} value
   */

  writeI32BE(value) {
    this.offset += 4;
    this.ops.push(new NumberOp(I32BE, value));
    return this;
  }

  /**
   * Write int64le.
   * @param {Number} value
   */

  writeI64(value) {
    this.offset += 8;
    this.ops.push(new NumberOp(I64, value));
    return this;
  }

  /**
   * Write int64be.
   * @param {Number} value
   */

  writeI64BE(value) {
    this.offset += 8;
    this.ops.push(new NumberOp(I64BE, value));
    return this;
  }

  /**
   * Write float le.
   * @param {Number} value
   */

  writeFloat(value) {
    this.offset += 4;
    this.ops.push(new NumberOp(FL, value));
    return this;
  }

  /**
   * Write float be.
   * @param {Number} value
   */

  writeFloatBE(value) {
    this.offset += 4;
    this.ops.push(new NumberOp(FLBE, value));
    return this;
  }

  /**
   * Write double le.
   * @param {Number} value
   */

  writeDouble(value) {
    this.offset += 8;
    this.ops.push(new NumberOp(DBL, value));
    return this;
  }

  /**
   * Write double be.
   * @param {Number} value
   */

  writeDoubleBE(value) {
    this.offset += 8;
    this.ops.push(new NumberOp(DBLBE, value));
    return this;
  }

  /**
   * Write a varint.
   * @param {Number} value
   */

  writeVarint(value) {
    this.offset += encoding.sizeVarint(value);
    this.ops.push(new NumberOp(VARINT, value));
    return this;
  }

  /**
   * Write a varint (type 2).
   * @param {Number} value
   */

  writeVarint2(value) {
    this.offset += encoding.sizeVarint2(value);
    this.ops.push(new NumberOp(VARINT2, value));
    return this;
  }

  /**
   * Write bytes.
   * @param {Buffer} value
   */

  writeBytes(value) {
    if (value.length === 0)
      return this;

    this.offset += value.length;
    this.ops.push(new BufferOp(BYTES, value));

    return this;
  }

  /**
   * Write bytes with a varint length before them.
   * @param {Buffer} value
   */

  writeVarBytes(value) {
    this.offset += encoding.sizeVarint(value.length);
    this.ops.push(new NumberOp(VARINT, value.length));

    if (value.length === 0)
      return this;

    this.offset += value.length;
    this.ops.push(new BufferOp(BYTES, value));

    return this;
  }

  /**
   * Copy bytes.
   * @param {Buffer} value
   * @param {Number} start
   * @param {Number} end
   */

  copy(value, start, end) {
    assert(end >= start);
    value = value.slice(start, end);
    this.writeBytes(value);
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

    this.offset += Buffer.byteLength(value, enc);
    this.ops.push(new StringOp(STR, value, enc));

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
    this.writeString(value, 'hex');
    return this;
  }

  /**
   * Write a string with a varint length before it.
   * @param {String}
   * @param {String?} enc - Any buffer-supported encoding.
   */

  writeVarString(value, enc) {
    if (value.length === 0) {
      this.ops.push(new NumberOp(VARINT, 0));
      return this;
    }

    const size = Buffer.byteLength(value, enc);

    this.offset += encoding.sizeVarint(size);
    this.offset += size;

    this.ops.push(new NumberOp(VARINT, size));
    this.ops.push(new StringOp(STR, value, enc));

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
    this.ops.push(new FunctionOp(CHECKSUM, hash));
    return this;
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

    this.offset += size;
    this.ops.push(new FillOp(FILL, value, size));

    return this;
  }
}

/*
 * Helpers
 */

class WriteOp {
  constructor(type) {
    this.type = type;
  }
}

class NumberOp extends WriteOp {
  constructor(type, value) {
    super(type);
    this.value = value;
  }
}

class BufferOp extends WriteOp {
  constructor(type, data) {
    super(type);
    this.data = data;
  }
}

class StringOp extends WriteOp {
  constructor(type, value, enc) {
    super(type);
    this.value = value;
    this.enc = enc;
  }
}

class FunctionOp extends WriteOp {
  constructor(type, func) {
    super(type);
    this.func = func;
  }
}

class FillOp extends WriteOp {
  constructor(type, value, size) {
    super(type);
    this.value = value;
    this.size = size;
  }
}

/*
 * Expose
 */

module.exports = BufferWriter;
