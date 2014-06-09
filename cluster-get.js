var net = require('net')

  , once = require('once')
  , parallel = require('run-parallel')
  , multilevel = require('multilevel')

  , parse = function (address) {
      var parts = address.split(':')
      return {
          host: parts[0]
        , port: parseInt(parts[1], 10)
      }
    }

  , getFactory = function (config) {
      return function (key, callback) {
        var tasks = {}

        config.servers.forEach(function (address) {
          tasks[address] = function (done) {
            var con = net.connect(parse(address))
              , db = multilevel.client()

            done = once(done)

            con.pipe(db.createRpcStream()).pipe(con)
            con.once('error', done)
            db.get(key, function (err, value) {
              con.end()
              if (err)
                done(
                    null
                  , { error: err }
                )
              else
                done(
                    null
                  , { value: value }
                )

            })
          }
        })
        parallel(tasks, callback)
      }
    }

  , clusterGet = function (db, config) {
      var server = net.createServer(function (con) {
            con.pipe(multilevel.server(db)).pipe(con)
          }).listen(config.port)
        , factory = getFactory(config)

      factory.close = function (callback) {
        server.close(callback)
      }

      return factory
    }

module.exports = clusterGet