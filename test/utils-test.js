/* eslint-env mocha */
/* eslint prefer-arrow-callback: "off" */

'use strict';

const assert = require('./util/assert');
const {U64, I64} = require('n64');
const encoding = require('../lib/encoding');

const unsigned = [
  new U64('ffeeffee', 16),
  new U64('001fffeeffeeffee', 16),
  new U64('eeffeeff', 16),
  new U64('001feeffeeffeeff', 16),
  new U64(0),
  new U64(1)
];

const signed = [
  new I64('ffeeffee', 16),
  new I64('001fffeeffeeffee', 16),
  new I64('eeffeeff', 16),
  new I64('001feeffeeffeeff', 16),
  new I64(0),
  new I64(1),
  new I64('ffeeffee', 16).ineg(),
  new I64('001fffeeffeeffee', 16).ineg(),
  new I64('eeffeeff', 16).ineg(),
  new I64('001feeffeeffeeff', 16).ineg(),
  new I64(0).ineg(),
  new I64(1).ineg()
];

describe('bufio', function() {
  it('should write/read new varints', () => {
    /*
     * 0:         [0x00]  256:        [0x81 0x00]
     * 1:         [0x01]  16383:      [0xFE 0x7F]
     * 127:       [0x7F]  16384:      [0xFF 0x00]
     * 128:  [0x80 0x00]  16511: [0x80 0xFF 0x7F]
     * 255:  [0x80 0x7F]  65535: [0x82 0xFD 0x7F]
     * 2^32:           [0x8E 0xFE 0xFE 0xFF 0x00]
     */

    let b = Buffer.alloc(1, 0xff);
    encoding.writeVarint2(b, 0, 0);
    assert.strictEqual(encoding.readVarint2(b, 0).value, 0);
    assert.deepEqual(b, [0]);

    b = Buffer.alloc(1, 0xff);
    encoding.writeVarint2(b, 1, 0);
    assert.strictEqual(encoding.readVarint2(b, 0).value, 1);
    assert.deepEqual(b, [1]);

    b = Buffer.alloc(1, 0xff);
    encoding.writeVarint2(b, 127, 0);
    assert.strictEqual(encoding.readVarint2(b, 0).value, 127);
    assert.deepEqual(b, [0x7f]);

    b = Buffer.alloc(2, 0xff);
    encoding.writeVarint2(b, 128, 0);
    assert.strictEqual(encoding.readVarint2(b, 0).value, 128);
    assert.deepEqual(b, [0x80, 0x00]);

    b = Buffer.alloc(2, 0xff);
    encoding.writeVarint2(b, 255, 0);
    assert.strictEqual(encoding.readVarint2(b, 0).value, 255);
    assert.deepEqual(b, [0x80, 0x7f]);

    b = Buffer.alloc(2, 0xff);
    encoding.writeVarint2(b, 16383, 0);
    assert.strictEqual(encoding.readVarint2(b, 0).value, 16383);
    assert.deepEqual(b, [0xfe, 0x7f]);

    b = Buffer.alloc(2, 0xff);
    encoding.writeVarint2(b, 16384, 0);
    assert.strictEqual(encoding.readVarint2(b, 0).value, 16384);
    assert.deepEqual(b, [0xff, 0x00]);

    b = Buffer.alloc(3, 0xff);
    encoding.writeVarint2(b, 16511, 0);
    assert.strictEqual(encoding.readVarint2(b, 0).value, 16511);
    assert.deepEqual(b.slice(0, 2), [0xff, 0x7f]);
    // assert.deepEqual(b, [0x80, 0xff, 0x7f]);

    b = Buffer.alloc(3, 0xff);
    encoding.writeVarint2(b, 65535, 0);
    assert.strictEqual(encoding.readVarint2(b, 0).value, 65535);
    assert.deepEqual(b, [0x82, 0xfe, 0x7f]);
    // assert.deepEqual(b, [0x82, 0xfd, 0x7f]);

    b = Buffer.alloc(5, 0xff);
    encoding.writeVarint2(b, Math.pow(2, 32), 0);
    assert.strictEqual(encoding.readVarint2(b, 0).value, Math.pow(2, 32));
    assert.deepEqual(b, [0x8e, 0xfe, 0xfe, 0xff, 0x00]);
  });

  for (const num of unsigned) {
    const bits = num.bitLength();

    it(`should write+read a ${bits} bit unsigned int`, () => {
      const buf2 = Buffer.allocUnsafe(8);

      encoding.writeU64(buf2, num.toNumber(), 0);

      const n2 = encoding.readU64(buf2, 0);

      assert.strictEqual(num.toNumber(), n2);
    });
  }

  for (const num of signed) {
    const bits = num.bitLength();
    const sign = num.isNeg() ? 'negative' : 'positive';

    it(`should write+read a ${bits} bit ${sign} int`, () => {
      const buf2 = Buffer.allocUnsafe(8);

      encoding.writeI64(buf2, num.toNumber(), 0);

      const n2 = encoding.readI64(buf2, 0);

      assert.strictEqual(num.toNumber(), n2);
    });

    it(`should write+read a ${bits} bit ${sign} int as unsigned`, () => {
      const buf2 = Buffer.allocUnsafe(8);

      encoding.writeU64(buf2, num.toNumber(), 0);

      if (num.isNeg()) {
        assert.throws(() => encoding.readU64(buf2, 0));
      } else {
        const n2 = encoding.readU64(buf2, 0);
        assert.strictEqual(num.toNumber(), n2);
      }
    });
  }
});
