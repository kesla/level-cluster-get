var level = require('level-test')()
  , test = require('tap').test

test('simple', function (t) {
  var level = require('level-test')()
    , clusterGet = require('../cluster-get')

    // server 1
    , config1 = {
          servers: [
              '127.0.0.1:8001'
          ]
        , port: 8000
      }
    , db1 = level('server1')
    , get1 = clusterGet(db1, config1)

    // server 2
    , config2 = {
          servers: [
              '127.0.0.1:8000'
          ]
        , port: 8001
      }
    , db2 = level('server2')
    , get2 = clusterGet(db2, config2)

  get1('foo', function (err, data) {
    t.error(err)
    t.deepEqual(
        {
            '127.0.0.1:8001': { error: { cause: {}, name: 'NotFoundError', notFound: true, status: 404 } }
        }
      , data
    )
    get1.close()
    get2.close()
    t.end()
  })
})