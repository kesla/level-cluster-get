var level = require('level-test')()
  , test = require('tape')

test('simple', function (t) {
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
    , db1 = level('simple-server1')
    , get1 = clusterGet(db1, config1)

    // server 2
    , config2 = {
          servers: [
              '127.0.0.1:8000'
            , '127.0.0.1:8002'
          ]
        , port: 8001
      }
    , db2 = level('simple-server2')
    , get2 = clusterGet(db2, config2)

    // server 3
    , config3 = {
          servers: [
              '127.0.0.1:8000'
            , '127.0.0.1:8001'
          ]
        , port: 8002
      }
    , db3 = level('simple-server3')
    , get3 = clusterGet(db3, config3)

  db1.put('foo', 'bar', function () {
    db2.put('foo', 'bas', function () {
      get3('foo', function (err, data) {
        t.error(err)
        t.deepEqual(
            {
                '127.0.0.1:8000': { value: 'bar' }
              , '127.0.0.1:8001': { value: 'bas' }
            }
          , data
        )
        get1.close()
        get2.close()
        get3.close()
        t.end()
      })
    })
  })
})