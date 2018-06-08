/*!
 * encoding.js - encoding utils for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

/* eslint no-implicit-coercion: "off" */

'use strict';

const EncodingError = require('./error');

/*
 * Constants
 */

const {MAX_SAFE_INTEGER} = Number;
const {floor} = Math;
const float32Array = new Float32Array(1);
const uInt8Float32Array = new Uint8Array(float32Array.buffer);
const float64Array = new Float64Array(1);
const uInt8Float64Array = new Uint8Array(float64Array.buffer);

float32Array[0] = -1;

const bigEndian = uInt8Float32Array[3] === 0;

/*
 * Read Unsigned LE
 */

function readU(data, off, len) {
  switch (len) {
    case 8:
      return readU64(data, off);
    case 7:
      return readU56(data, off);
    case 6:
      return readU48(data, off);
    case 5:
      return readU40(data, off);
    case 4:
      return readU32(data, off);
    case 3:
      return readU24(data, off);
    case 2:
      return readU16(data, off);
    case 1:
      return readU8(data, off);
    default:
      throw new EncodingError(off, 'Invalid read length');
  }
}

function readU64(data, off) {
  const hi = readU32(data, off + 4);
  const lo = readU32(data, off);
  enforce((hi & 0xffe00000) === 0, off, 'Number exceeds 2^53-1');
  return hi * 0x100000000 + lo;
}

function readU56(data, off) {
  const hi = readU24(data, off + 4);
  const lo = readU32(data, off);
  enforce((hi & 0xffe00000) === 0, off, 'Number exceeds 2^53-1');
  return hi * 0x100000000 + lo;
}

function readU48(data, off) {
  const first = data[off];
  const last = data[off + 5];

  return first +
    data[++off] * 2 ** 8 +
    data[++off] * 2 ** 16 +
    data[++off] * 2 ** 24 +
    (data[++off] + last * 2 ** 8) * 2 ** 32;
}

function readU40(data, off) {
  const first = data[off];
  const last = data[off + 4];

  return first +
    data[++off] * 2 ** 8 +
    data[++off] * 2 ** 16 +
    data[++off] * 2 ** 24 +
    last * 2 ** 32;
}

function readU32(data, off) {
  const first = data[off];
  const last = data[off + 3];

  return first +
    data[++off] * 2 ** 8 +
    data[++off] * 2 ** 16 +
    last * 2 ** 24;
}

function readU24(data, off) {
  const first = data[off];
  const last = data[off + 2];

  return first + data[++off] * 2 ** 8 + last * 2 ** 16;
}

function readU16(data, off) {
  const first = data[off];
  const last = data[off + 1];

  return first + last * 2 ** 8;
}

function readU8(data, off) {
  return data[off];
}

/*
 * Read Unsigned BE
 */

function readUBE(data, off, len) {
  switch (len) {
    case 8:
      return readU64BE(data, off);
    case 7:
      return readU56BE(data, off);
    case 6:
      return readU48BE(data, off);
    case 5:
      return readU40BE(data, off);
    case 4:
      return readU32BE(data, off);
    case 3:
      return readU24BE(data, off);
    case 2:
      return readU16BE(data, off);
    case 1:
      return readU8(data, off);
    default:
      throw new EncodingError(off, 'Invalid read length');
  }
}

function readU64BE(data, off) {
  const hi = readU32BE(data, off);
  const lo = readU32BE(data, off + 4);
  enforce((hi & 0xffe00000) === 0, off, 'Number exceeds 2^53-1');
  return hi * 0x100000000 + lo;
}

function readU56BE(data, off) {
  const hi = readU24BE(data, off);
  const lo = readU32BE(data, off + 3);
  enforce((hi & 0xffe00000) === 0, off, 'Number exceeds 2^53-1');
  return hi * 0x100000000 + lo;
}

function readU48BE(data, off) {
  const first = data[off];
  const last = data[off + 5];

  return (first * 2 ** 8 + data[++off]) * 2 ** 32 +
    data[++off] * 2 ** 24 +
    data[++off] * 2 ** 16 +
    data[++off] * 2 ** 8 +
    last;
}

function readU40BE(data, off) {
  const first = data[off];
  const last = data[off + 4];

  return first * 2 ** 32 +
    data[++off] * 2 ** 24 +
    data[++off] * 2 ** 16 +
    data[++off] * 2 ** 8 +
    last;
}

function readU32BE(data, off) {
  const first = data[off];
  const last = data[off + 3];

  return first * 2 ** 24 +
    data[++off] * 2 ** 16 +
    data[++off] * 2 ** 8 +
    last;
}

function readU24BE(data, off) {
  const first = data[off];
  const last = data[off + 2];

  return first * 2 ** 16 + data[++off] * 2 ** 8 + last;
}

function readU16BE(data, off) {
  const first = data[off];
  const last = data[off + 1];

  return first * 2 ** 8 + last;
}

/*
 * Read Signed LE
 */

function readI(data, off, len) {
  switch (len) {
    case 8:
      return readI64(data, off);
    case 7:
      return readI56(data, off);
    case 6:
      return readI48(data, off);
    case 5:
      return readI40(data, off);
    case 4:
      return readI32(data, off);
    case 3:
      return readI24(data, off);
    case 2:
      return readI16(data, off);
    case 1:
      return readI8(data, off);
    default:
      throw new EncodingError(off, 'Invalid read length');
  }
}

function readI64(data, off) {
  const hi = readI32(data, off + 4);
  const lo = readU32(data, off);
  enforce(isSafe(hi, lo), 'Number exceeds 2^53-1');
  return hi * 0x100000000 + lo;
}

function readI56(data, off) {
  const hi = readI24(data, off + 4);
  const lo = readU32(data, off);
  enforce(isSafe(hi, lo), 'Number exceeds 2^53-1');
  return hi * 0x100000000 + lo;
}

function readI48(data, off) {
  const first = data[off];
  const last = data[off + 5];

  const val = data[off + 4] + last * 2 ** 8;
  return (val | (val & 2 ** 15) * 0x1fffe) * 2 ** 32 +
    first +
    data[++off] * 2 ** 8 +
    data[++off] * 2 ** 16 +
    data[++off] * 2 ** 24;
}

function readI40(data, off) {
  const first = data[off];
  const last = data[off + 4];

  return (last | (last & 2 ** 7) * 0x1fffffe) * 2 ** 32 +
    first +
    data[++off] * 2 ** 8 +
    data[++off] * 2 ** 16 +
    data[++off] * 2 ** 24;
}

function readI32(data, off) {
  const first = data[off];
  const last = data[off + 3];

  return first +
    data[++off] * 2 ** 8 +
    data[++off] * 2 ** 16 +
    (last << 24); // Overflow
}

function readI24(data, off) {
  const first = data[off];
  const last = data[off + 2];

  const val = first + data[++off] * 2 ** 8 + last * 2 ** 16;
  return val | (val & 2 ** 23) * 0x1fe;
}

function readI16(data, off) {
  const first = data[off];
  const last = data[off + 1];
  const val = first + last * 2 ** 8;
  return val | (val & 2 ** 15) * 0x1fffe;
}

function readI8(data, off) {
  const val = data[off];
  return val | (val & 2 ** 7) * 0x1fffffe;
}

/*
 * Read Signed BE
 */

function readIBE(data, off, len) {
  switch (len) {
    case 8:
      return readI64BE(data, off);
    case 7:
      return readI56BE(data, off);
    case 6:
      return readI48BE(data, off);
    case 5:
      return readI40BE(data, off);
    case 4:
      return readI32BE(data, off);
    case 3:
      return readI24BE(data, off);
    case 2:
      return readI16BE(data, off);
    case 1:
      return readI8(data, off);
    default:
      throw new EncodingError(off, 'Invalid read length');
  }
}

function readI64BE(data, off) {
  const hi = readI32BE(data, off);
  const lo = readU32BE(data, off + 4);
  enforce(isSafe(hi, lo), 'Number exceeds 2^53-1');
  return hi * 0x100000000 + lo;
}

function readI56BE(data, off) {
  const hi = readI24BE(data, off);
  const lo = readU32BE(data, off + 3);
  enforce(isSafe(hi, lo), 'Number exceeds 2^53-1');
  return hi * 0x100000000 + lo;
}

function readI48BE(data, off) {
  const first = data[off];
  const last = data[off + 5];

  const val = data[++off] + first * 2 ** 8;
  return (val | (val & 2 ** 15) * 0x1fffe) * 2 ** 32 +
    data[++off] * 2 ** 24 +
    data[++off] * 2 ** 16 +
    data[++off] * 2 ** 8 +
    last;
}

function readI40BE(data, off) {
  const first = data[off];
  const last = data[off + 4];

  return (first | (first & 2 ** 7) * 0x1fffffe) * 2 ** 32 +
    data[++off] * 2 ** 24 +
    data[++off] * 2 ** 16 +
    data[++off] * 2 ** 8 +
    last;
}

function readI32BE(data, off) {
  const first = data[off];
  const last = data[off + 3];

  return (first << 24) + // Overflow
    data[++off] * 2 ** 16 +
    data[++off] * 2 ** 8 +
    last;
}

function readI24BE(data, off) {
  const first = data[off];
  const last = data[off + 2];

  const val = first * 2 ** 16 + data[++off] * 2 ** 8 + last;
  return val | (val & 2 ** 23) * 0x1fe;
}

function readI16BE(data, off) {
  const first = data[off];
  const last = data[off + 1];

  const val = first * 2 ** 8 + last;
  return val | (val & 2 ** 15) * 0x1fffe;
}

/*
 * Read Float
 */

function _readFloatBackwards(data, off) {
  const first = data[off];
  const last = data[off + 3];

  uInt8Float32Array[3] = first;
  uInt8Float32Array[2] = data[++off];
  uInt8Float32Array[1] = data[++off];
  uInt8Float32Array[0] = last;
  return float32Array[0];
}

function _readFloatForwards(data, off) {
  const first = data[off];
  const last = data[off + 3];

  uInt8Float32Array[0] = first;
  uInt8Float32Array[1] = data[++off];
  uInt8Float32Array[2] = data[++off];
  uInt8Float32Array[3] = last;
  return float32Array[0];
}

function _readDoubleBackwards(data, off) {
  const first = data[off];
  const last = data[off + 7];

  uInt8Float64Array[7] = first;
  uInt8Float64Array[6] = data[++off];
  uInt8Float64Array[5] = data[++off];
  uInt8Float64Array[4] = data[++off];
  uInt8Float64Array[3] = data[++off];
  uInt8Float64Array[2] = data[++off];
  uInt8Float64Array[1] = data[++off];
  uInt8Float64Array[0] = last;
  return float64Array[0];
}

function _readDoubleForwards(data, off) {
  const first = data[off];
  const last = data[off + 7];

  uInt8Float64Array[0] = first;
  uInt8Float64Array[1] = data[++off];
  uInt8Float64Array[2] = data[++off];
  uInt8Float64Array[3] = data[++off];
  uInt8Float64Array[4] = data[++off];
  uInt8Float64Array[5] = data[++off];
  uInt8Float64Array[6] = data[++off];
  uInt8Float64Array[7] = last;
  return float64Array[0];
}

const readFloat = bigEndian ? _readFloatBackwards : _readFloatForwards;
const readFloatBE = bigEndian ? _readFloatForwards : _readFloatBackwards;
const readDouble = bigEndian ? _readDoubleBackwards : _readDoubleForwards;
const readDoubleBE = bigEndian ? _readDoubleForwards : _readDoubleBackwards;

/*
 * Write Unsigned LE
 */

function writeU(dst, num, off, len) {
  switch (len) {
    case 8:
      return writeU64(dst, num, off);
    case 7:
      return writeU56(dst, num, off);
    case 6:
      return writeU48(dst, num, off);
    case 5:
      return writeU40(dst, num, off);
    case 4:
      return writeU32(dst, num, off);
    case 3:
      return writeU24(dst, num, off);
    case 2:
      return writeU16(dst, num, off);
    case 1:
      return writeU8(dst, num, off);
    default:
      throw new EncodingError(off, 'Invalid write length');
  }
}

function writeU64(dst, num, off) {
  return write64(dst, num, off, false);
}

function writeU56(dst, num, off) {
  return write56(dst, num, off, false);
}

function writeU48(dst, num, off) {
  num = +num;

  const newVal = floor(num * 2 ** -32);
  dst[off++] = num;
  num = num >>> 8;
  dst[off++] = num;
  num = num >>> 8;
  dst[off++] = num;
  num = num >>> 8;
  dst[off++] = num;
  dst[off++] = newVal;
  dst[off++] = (newVal >>> 8);
  return off;
}

function writeU40(dst, num, off) {
  num = +num;

  const newVal = num;
  dst[off++] = num;
  num = num >>> 8;
  dst[off++] = num;
  num = num >>> 8;
  dst[off++] = num;
  num = num >>> 8;
  dst[off++] = num;
  dst[off++] = floor(newVal * 2 ** -32);
  return off;
}

function writeU32(dst, num, off) {
  num = +num;

  dst[off++] = num;
  num = num >>> 8;
  dst[off++] = num;
  num = num >>> 8;
  dst[off++] = num;
  num = num >>> 8;
  dst[off++] = num;
  return off;
}

function writeU24(dst, num, off) {
  num = +num;

  dst[off++] = num;
  num = num >>> 8;
  dst[off++] = num;
  num = num >>> 8;
  dst[off++] = num;
  return off;
}

function writeU16(dst, num, off) {
  num = +num;

  dst[off++] = num;
  dst[off++] = (num >>> 8);
  return off;
}

function writeU8(dst, num, off) {
  num = +num;
  dst[off] = num;
  return off + 1;
}

/*
 * Write Unsigned BE
 */

function writeUBE(dst, num, off, len) {
  switch (len) {
    case 8:
      return writeU64BE(dst, num, off);
    case 7:
      return writeU56BE(dst, num, off);
    case 6:
      return writeU48BE(dst, num, off);
    case 5:
      return writeU40BE(dst, num, off);
    case 4:
      return writeU32BE(dst, num, off);
    case 3:
      return writeU24BE(dst, num, off);
    case 2:
      return writeU16BE(dst, num, off);
    case 1:
      return writeU8(dst, num, off);
    default:
      throw new EncodingError(off, 'Invalid write length');
  }
}

function writeU64BE(dst, num, off) {
  return write64(dst, num, off, true);
}

function writeU56BE(dst, num, off) {
  return write56(dst, num, off, true);
}

function writeU48BE(dst, num, off) {
  num = +num;

  const newVal = floor(num * 2 ** -32);
  dst[off++] = (newVal >>> 8);
  dst[off++] = newVal;
  dst[off + 3] = num;
  num = num >>> 8;
  dst[off + 2] = num;
  num = num >>> 8;
  dst[off + 1] = num;
  num = num >>> 8;
  dst[off] = num;
  return off + 4;
}

function writeU40BE(dst, num, off) {
  num = +num;

  dst[off++] = floor(num * 2 ** -32);
  dst[off + 3] = num;
  num = num >>> 8;
  dst[off + 2] = num;
  num = num >>> 8;
  dst[off + 1] = num;
  num = num >>> 8;
  dst[off] = num;
  return off + 4;
}

function writeU32BE(dst, num, off) {
  num = +num;

  dst[off + 3] = num;
  num = num >>> 8;
  dst[off + 2] = num;
  num = num >>> 8;
  dst[off + 1] = num;
  num = num >>> 8;
  dst[off] = num;
  return off + 4;
}

function writeU24BE(dst, num, off) {
  num = +num;

  dst[off + 2] = num;
  num = num >>> 8;
  dst[off + 1] = num;
  num = num >>> 8;
  dst[off] = num;
  return off + 3;
}

function writeU16BE(dst, num, off) {
  num = +num;

  dst[off++] = (num >>> 8);
  dst[off++] = num;
  return off;
}

/*
 * Write Signed LE
 */

function writeI(dst, num, off, len) {
  switch (len) {
    case 8:
      return writeU64(dst, num, off);
    case 7:
      return writeU56(dst, num, off);
    case 6:
      return writeU48(dst, num, off);
    case 5:
      return writeU40(dst, num, off);
    case 4:
      return writeU24(dst, num, off);
    case 3:
      return writeU32(dst, num, off);
    case 2:
      return writeU16(dst, num, off);
    case 1:
      return writeU8(dst, num, off);
    default:
      throw new EncodingError(off, 'Invalid write length');
  }
}

function writeI64(dst, num, off) {
  return writeU64(dst, num, off);
}

function writeI56(dst, num, off) {
  return writeU56(dst, num, off);
}

function writeI48(dst, num, off) {
  return writeU48(dst, num, off);
}

function writeI40(dst, num, off) {
  return writeU40(dst, num, off);
}

function writeI32(dst, num, off) {
  return writeU32(dst, num, off);
}

function writeI24(dst, num, off) {
  return writeU24(dst, num, off);
}

function writeI16(dst, num, off) {
  return writeU16(dst, num, off);
}

function writeI8(dst, num, off) {
  return writeU8(dst, num, off);
}

/*
 * Write Signed BE
 */

function writeIBE(dst, num, off, len) {
  switch (len) {
    case 8:
      return writeU64BE(dst, num, off);
    case 7:
      return writeU56BE(dst, num, off);
    case 6:
      return writeU48BE(dst, num, off);
    case 5:
      return writeU40BE(dst, num, off);
    case 4:
      return writeU32BE(dst, num, off);
    case 3:
      return writeU24BE(dst, num, off);
    case 2:
      return writeU16BE(dst, num, off);
    case 1:
      return writeU8(dst, num, off);
    default:
      throw new EncodingError(off, 'Invalid write length');
  }
}

function writeI64BE(dst, num, off) {
  return writeU64BE(dst, num, off);
}

function writeI56BE(dst, num, off) {
  return writeU56BE(dst, num, off);
}

function writeI48BE(dst, num, off) {
  return writeU48BE(dst, num, off);
}

function writeI40BE(dst, num, off) {
  return writeU40BE(dst, num, off);
}

function writeI32BE(dst, num, off) {
  return writeU32BE(dst, num, off);
}

function writeI24BE(dst, num, off) {
  return writeU24BE(dst, num, off);
}

function writeI16BE(dst, num, off) {
  return writeU16BE(dst, num, off);
}

function _writeDoubleForwards(dst, num, off) {
  num = +num;

  float64Array[0] = num;
  dst[off++] = uInt8Float64Array[0];
  dst[off++] = uInt8Float64Array[1];
  dst[off++] = uInt8Float64Array[2];
  dst[off++] = uInt8Float64Array[3];
  dst[off++] = uInt8Float64Array[4];
  dst[off++] = uInt8Float64Array[5];
  dst[off++] = uInt8Float64Array[6];
  dst[off++] = uInt8Float64Array[7];
  return off;
}

function _writeDoubleBackwards(dst, num, off) {
  num = +num;

  float64Array[0] = num;
  dst[off++] = uInt8Float64Array[7];
  dst[off++] = uInt8Float64Array[6];
  dst[off++] = uInt8Float64Array[5];
  dst[off++] = uInt8Float64Array[4];
  dst[off++] = uInt8Float64Array[3];
  dst[off++] = uInt8Float64Array[2];
  dst[off++] = uInt8Float64Array[1];
  dst[off++] = uInt8Float64Array[0];
  return off;
}

function _writeFloatForwards(dst, num, off) {
  num = +num;

  float32Array[0] = num;
  dst[off++] = uInt8Float32Array[0];
  dst[off++] = uInt8Float32Array[1];
  dst[off++] = uInt8Float32Array[2];
  dst[off++] = uInt8Float32Array[3];
  return off;
}

function _writeFloatBackwards(dst, num, off) {
  num = +num;

  float32Array[0] = num;
  dst[off++] = uInt8Float32Array[3];
  dst[off++] = uInt8Float32Array[2];
  dst[off++] = uInt8Float32Array[1];
  dst[off++] = uInt8Float32Array[0];
  return off;
}

const writeFloat = bigEndian ? _writeFloatBackwards : _writeFloatForwards;
const writeFloatBE = bigEndian ? _writeFloatForwards : _writeFloatBackwards;
const writeDouble = bigEndian ? _writeDoubleBackwards : _writeDoubleForwards;
const writeDoubleBE = bigEndian ? _writeDoubleForwards : _writeDoubleBackwards;

/*
 * Varints
 */

function readVarint(data, off) {
  let value, size;

  check(off < data.length, off);

  switch (data[off]) {
    case 0xff:
      size = 9;
      check(off + size <= data.length, off);
      value = readU64(data, off + 1);
      enforce(value > 0xffffffff, off, 'Non-canonical varint');
      break;
    case 0xfe:
      size = 5;
      check(off + size <= data.length, off);
      value = readU32(data, off + 1);
      enforce(value > 0xffff, off, 'Non-canonical varint');
      break;
    case 0xfd:
      size = 3;
      check(off + size <= data.length, off);
      value = data[off + 1] | (data[off + 2] << 8);
      enforce(value >= 0xfd, off, 'Non-canonical varint');
      break;
    default:
      size = 1;
      value = data[off];
      break;
  }

  return new Varint(size, value);
}

function writeVarint(dst, num, off) {
  if (num < 0xfd) {
    dst[off++] = num & 0xff;
    return off;
  }

  if (num <= 0xffff) {
    dst[off++] = 0xfd;
    dst[off++] = num & 0xff;
    dst[off++] = (num >> 8) & 0xff;
    return off;
  }

  if (num <= 0xffffffff) {
    dst[off++] = 0xfe;
    dst[off++] = num & 0xff;
    dst[off++] = (num >> 8) & 0xff;
    dst[off++] = (num >> 16) & 0xff;
    dst[off++] = num >>> 24;
    return off;
  }

  dst[off++] = 0xff;
  off = writeU64(dst, num, off);
  return off;
}

function sizeVarint(num) {
  if (num < 0xfd)
    return 1;

  if (num <= 0xffff)
    return 3;

  if (num <= 0xffffffff)
    return 5;

  return 9;
}

function readVarint2(data, off) {
  let num = 0;
  let size = 0;

  for (;;) {
    check(off < data.length, off);

    const ch = data[off++];
    size += 1;

    // Number.MAX_SAFE_INTEGER >>> 7
    enforce(num <= 0x3fffffffffff - (ch & 0x7f), off, 'Number exceeds 2^53-1');

    // num = (num << 7) | (ch & 0x7f);
    num = (num * 0x80) + (ch & 0x7f);

    if ((ch & 0x80) === 0)
      break;

    enforce(num !== MAX_SAFE_INTEGER, off, 'Number exceeds 2^53-1');
    num += 1;
  }

  return new Varint(size, num);
}

function writeVarint2(dst, num, off) {
  const tmp = [];

  let len = 0;

  for (;;) {
    tmp[len] = (num & 0x7f) | (len ? 0x80 : 0x00);
    if (num <= 0x7f)
      break;
    // num = (num >>> 7) - 1;
    num = ((num - (num % 0x80)) / 0x80) - 1;
    len += 1;
  }

  check(off + len + 1 <= dst.length, off);

  do {
    dst[off++] = tmp[len];
  } while (len--);

  return off;
}

function sizeVarint2(num) {
  let size = 0;

  for (;;) {
    size += 1;
    if (num <= 0x7f)
      break;
    // num = (num >>> 7) - 1;
    num = ((num - (num % 0x80)) / 0x80) - 1;
  }

  return size;
}

/*
 * Bytes
 */

function sliceBytes(data, off, size) {
  if (off + size > data.length)
    throw new EncodingError(off, 'Out of bounds read');

  return data.slice(off, off + size);
}

function readBytes(data, off, size) {
  if (off + size > data.length)
    throw new EncodingError(off, 'Out of bounds read');

  const buf = Buffer.allocUnsafe(size);
  data.copy(buf, 0, off, off + size);
  return buf;
}

function writeBytes(data, value, off) {
  if (off + value.length > data.length)
    throw new EncodingError(off, 'Out of bounds write');

  return value.copy(data, off, 0, value.length);
}

function readString(data, off, size, enc) {
  if (!enc)
    enc = 'ascii';

  if (off + size > data.length)
    throw new EncodingError(off, 'Out of bounds read');

  return data.toString(enc, off, off + size);
}

function writeString(data, str, off, enc) {
  if (!enc)
    enc = 'ascii';

  if (str.length === 0)
    return 0;

  const size = Buffer.byteLength(str, enc);

  if (off + size > data.length)
    throw new EncodingError(off, 'Out of bounds write');

  data.write(str, off, enc);

  return size;
}

function realloc(data, size) {
  const buf = Buffer.allocUnsafe(size);
  data.copy(buf, 0);
  return buf;
}

function copy(data) {
  return realloc(data, data.length);
}

function concat(a, b) {
  const size = a.length + b.length;
  const buf = Buffer.allocUnsafe(size);
  a.copy(buf, 0);
  b.copy(buf, a.length);
  return buf;
}

/*
 * Size Helpers
 */

function sizeVarBytes(data) {
  return sizeVarint(data.length) + data.length;
}

function sizeVarlen(len) {
  return sizeVarint(len) + len;
}

function sizeVarString(str, enc) {
  if (typeof str !== 'string')
    return sizeVarBytes(str);

  const len = Buffer.byteLength(str, enc);

  return sizeVarint(len) + len;
}

/*
 * Helpers
 */

function isSafe(hi, lo) {
  if (hi < 0) {
    hi = ~hi;
    if (lo === 0)
      hi += 1;
  }

  return (hi & 0xffe00000) === 0;
}

function write64(dst, num, off, be) {
  let neg = false;

  if (num < 0) {
    num = -num;
    neg = true;
  }

  let hi = (num * (1 / 0x100000000)) | 0;
  let lo = num | 0;

  if (neg) {
    if (lo === 0) {
      hi = (~hi + 1) | 0;
    } else {
      hi = ~hi;
      lo = ~lo + 1;
    }
  }

  if (be) {
    off = writeI32BE(dst, hi, off);
    off = writeI32BE(dst, lo, off);
  } else {
    off = writeI32(dst, lo, off);
    off = writeI32(dst, hi, off);
  }

  return off;
}

function write56(dst, num, off, be) {
  let neg = false;

  if (num < 0) {
    num = -num;
    neg = true;
  }

  let hi = (num * (1 / 0x100000000)) | 0;
  let lo = num | 0;

  if (neg) {
    if (lo === 0) {
      hi = (~hi + 1) | 0;
    } else {
      hi = ~hi;
      lo = ~lo + 1;
    }
  }

  if (be) {
    off = writeI24BE(dst, hi, off);
    off = writeI32BE(dst, lo, off);
  } else {
    off = writeI32(dst, lo, off);
    off = writeI24(dst, hi, off);
  }

  return off;
}

class Varint {
  constructor(size, value) {
    this.size = size;
    this.value = value;
  }
}

function check(value, offset) {
  if (!value)
    throw new EncodingError(offset, 'Out of bounds read', check);
}

function enforce(value, offset, reason) {
  if (!value)
    throw new EncodingError(offset, reason, enforce);
}

/*
 * Expose
 */

exports.readU = readU;
exports.readU64 = readU64;
exports.readU56 = readU56;
exports.readU48 = readU48;
exports.readU40 = readU40;
exports.readU32 = readU32;
exports.readU24 = readU24;
exports.readU16 = readU16;
exports.readU8 = readU8;

exports.readUBE = readUBE;
exports.readU64BE = readU64BE;
exports.readU56BE = readU56BE;
exports.readU48BE = readU48BE;
exports.readU40BE = readU40BE;
exports.readU32BE = readU32BE;
exports.readU24BE = readU24BE;
exports.readU16BE = readU16BE;

exports.readI = readI;
exports.readI64 = readI64;
exports.readI56 = readI56;
exports.readI48 = readI48;
exports.readI40 = readI40;
exports.readI32 = readI32;
exports.readI24 = readI24;
exports.readI16 = readI16;
exports.readI8 = readI8;

exports.readIBE = readIBE;
exports.readI64BE = readI64BE;
exports.readI56BE = readI56BE;
exports.readI48BE = readI48BE;
exports.readI40BE = readI40BE;
exports.readI32BE = readI32BE;
exports.readI24BE = readI24BE;
exports.readI16BE = readI16BE;

exports.readFloat = readFloat;
exports.readFloatBE = readFloatBE;
exports.readDouble = readDouble;
exports.readDoubleBE = readDoubleBE;

exports.writeU = writeU;
exports.writeU64 = writeU64;
exports.writeU56 = writeU56;
exports.writeU48 = writeU48;
exports.writeU40 = writeU40;
exports.writeU32 = writeU32;
exports.writeU24 = writeU24;
exports.writeU16 = writeU16;
exports.writeU8 = writeU8;

exports.writeUBE = writeUBE;
exports.writeU64BE = writeU64BE;
exports.writeU56BE = writeU56BE;
exports.writeU48BE = writeU48BE;
exports.writeU40BE = writeU40BE;
exports.writeU32BE = writeU32BE;
exports.writeU24BE = writeU24BE;
exports.writeU16BE = writeU16BE;

exports.writeI = writeI;
exports.writeI64 = writeI64;
exports.writeI56 = writeI56;
exports.writeI48 = writeI48;
exports.writeI40 = writeI40;
exports.writeI32 = writeI32;
exports.writeI24 = writeI24;
exports.writeI16 = writeI16;
exports.writeI8 = writeI8;

exports.writeIBE = writeIBE;
exports.writeI64BE = writeI64BE;
exports.writeI56BE = writeI56BE;
exports.writeI48BE = writeI48BE;
exports.writeI40BE = writeI40BE;
exports.writeI32BE = writeI32BE;
exports.writeI24BE = writeI24BE;
exports.writeI16BE = writeI16BE;

exports.writeFloat = writeFloat;
exports.writeFloatBE = writeFloatBE;
exports.writeDouble = writeDouble;
exports.writeDoubleBE = writeDoubleBE;

exports.readVarint = readVarint;
exports.writeVarint = writeVarint;
exports.sizeVarint = sizeVarint;
exports.readVarint2 = readVarint2;
exports.writeVarint2 = writeVarint2;
exports.sizeVarint2 = sizeVarint2;

exports.sliceBytes = sliceBytes;
exports.readBytes = readBytes;
exports.writeBytes = writeBytes;
exports.readString = readString;
exports.writeString = writeString;

exports.realloc = realloc;
exports.copy = copy;
exports.concat = concat;

exports.sizeVarBytes = sizeVarBytes;
exports.sizeVarlen = sizeVarlen;
exports.sizeVarString = sizeVarString;
