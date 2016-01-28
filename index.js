'use strict';
///////////////////////////////////////////////////////////////////

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

let getResource = function () {
  var ref = _asyncToGenerator(function* (STR) {
    try {
      // try to get as FS
      return yield getWithFS(STR);
    } catch (err_fs) {
      try {
        // try to get as uri
        let accepts_protocols = ['http:', 'https:'];
        let uri = require('url').parse(STR);

        if (uri.protocol === 'http:' || uri.protocol === 'https:') {
          return yield getWithHTTP(STR, uri.protocol);
        }
        // CAN ADD MORE PROTOCOLS HERE IF YOU WANT TO EXPAND OPTIONS
        // ...
        else {
            throw new Error(`Protocol ${ uri.protocol } was not recognized. Accepts: ${ accepts_protocols }`);
          }
      } catch (err_uri) {
        throw new Error(`Cannot get resource for ${ STR }
            from fs -- ${ err_fs.message }
            from uri -- ${ err_uri.message }`);
      }
    }
  });

  return function getResource(_x) {
    return ref.apply(this, arguments);
  };
}();
///////////////////////////////////////////////////////////////////

function getWithFS(path) {
  const denode = require('denodeify');
  const readFile = denode(require('fs').readFile);
  const _path = require('path').normalize(path);

  return readFile(_path, 'utf8');
}

function getWithHTTP(uri, protocol) {
  return new Promise((resolve, reject) => {
    const _get = protocol === 'https:' ? require('https').get : require('http').get;

    _get(uri).on('data', chunk => {
      resolve(chunk.toString());
    }).on('error', err => {
      err.message = 'http(s): ' + err.message;
      reject(err);
    });
  });
}
///////////////////////////////////////////////////////////////////
module.exports = getResource;
///////////////////////////////////////////////////////////////////

/* TCP -- NOT IMPLEMENTED

function fetchTCP(uri) {
   let net = require('net')
   let options = {
      path: uri.path,
      port: 8529
   }

   let client = net.connect(options, () => {
      console.log('connected to server!')
      client.on('data', (data) => {
         console.log(data.toString())
         client.end()
      })
      client.on('end', () => {
         console.log('disconnected from serer')
      })
      client.on('error', (err) => {
         console.log(err)
      })
      client.end()
   })
}

*/
