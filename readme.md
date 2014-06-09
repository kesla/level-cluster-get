# level-cluster-get[![build status](https://secure.travis-ci.org/kesla/level-cluster-get.png)](http://travis-ci.org/kesla/level-cluster-get)

Given a key, get what all values from a cluster of level-instances

[![NPM](https://nodei.co/npm/level-cluster-get.png?downloads&stars)](https://nodei.co/npm/level-cluster-get/)

[![NPM](https://nodei.co/npm-dl/level-cluster-get.png)](https://nodei.co/npm/level-cluster-get/)

## Installation

```
npm install level-cluster-get
```

## Example

### Input

```javascript
var level = require('level-test')()
  , clusterGet = require('./cluster-get')

  // server 1
  , config1 = {
        servers: [
            '127.0.0.1:8001'
          , '127.0.0.1:8002'
        ]
      , port: 8000
    }
  , db1 = level('server1')
  , get1 = clusterGet(db1, config1)

  // server 2
  , config2 = {
        servers: [
            '127.0.0.1:8000'
          , '127.0.0.1:8002'
        ]
      , port: 8001
    }
  , db2 = level('server2')
  , get2 = clusterGet(db2, config2)

  // server 3
  , config3 = {
        servers: [
            '127.0.0.1:8000'
          , '127.0.0.1:8001'
        ]
      , port: 8002
    }
  , db3 = level('server3')
  , get3 = clusterGet(db3, config3)

db1.put('foo', 'bar', function () {
  db2.put('foo', 'bas', function () {
    get3('foo', function (err, data) {
      console.log('data:', data)
      get1.close()
      get2.close()
      get3.close()
    })
  })
})
```

### Output

```
data: { '127.0.0.1:8000': { value: 'bar' },
  '127.0.0.1:8001': { value: 'bas' } }
```

## Licence

Copyright (c) 2014 David Björklund

This software is released under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
