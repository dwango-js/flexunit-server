var net = require('net');
var parseXML = require('xml2js').parseString;
var debug = require('debug')('flexunit:server');

var vars = require('./vars.js');

exports.createServer = function(reporter){
  var server = net.createServer(function(sock){

    debug('Client connected: ' + sock.remoteAddress);

    sock.setEncoding('utf8');

    sock.on('data', function(data){
      debug('data recieved: ' + data);
      parseXML(
        '<root>' + data.replace('\x00', '') + '</root>',
        function(err, obj){
          if (err) {
            server.emit('error', err);
            return;
          }
          debug(obj);

          if (vars.POLICY_FILE_REQUEST in obj.root) {
            debug('Policyfile request accepted');
            sock.end(vars.POLICY_FILE_CONTENT, 'ascii');
          }

          if ('testcase' in obj.root) {
            reporter.write(JSON.stringify({
              testcase: obj.root.testcase
            }));
          }

          if (vars.END_OF_TEST_RUN in obj.root) {
            debug('sending ack_end_of_test_run');
            sock.end(vars.END_OF_TEST_RUN_ACK_TOKEN);
            server.close();
          }
        }
      );
    });

    // timeout callback will be called only once so no need to explicitly
    // disable
    // http://nodejs.org/api/net.html#net_socket_settimeout_timeout_callback
    sock.setTimeout(1 * 1000, function(){
      debug('Timeout, send ack_start_of_test_run');
      sock.write(vars.START_OF_TEST_RUN_ACK_TOKEN);
    });

    sock.on('close', function(){
      debug('Client connection closed');
    });
  });

  server.on('close', function(){
    debug('Server close event');
  });

  return server;
};
