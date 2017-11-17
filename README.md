# bufio

Buffer and serialization utilities for javascript.

## Usage

``` js
const assert = require('assert');
const bio = require('bufio');

const bw = bio.write();
bw.writeU64(100);
bw.writeString('foo', 'ascii');
const data = bw.render();

const br = bio.read(data);
assert(br.readU64() === 100);
assert(br.readString('ascii') === 'foo');
```

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work. `</legalese>`

## License

- Copyright (c) 2017, Christopher Jeffrey (MIT License).

See LICENSE for more info.
