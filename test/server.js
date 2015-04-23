var net  = require('net');
var readFileSync = require('fs').readFileSync;

var expect = require('chai').expect;
var debug = require('debug')('flexunit:test');
var PassThrough = require('stream').PassThrough;

var fuserver = require('../lib').createServer;

var vars = require('../lib/vars.js');

var PORT = 1024;
var HOST = '127.0.0.1';

var FIXTURE = __dirname + '/fixtures/';

module.exports = function(){
  var flexunitResultSuccessJSON = readFileSync(FIXTURE +
                                               'flexunit_result_success.json',
                                               'utf-8');
  var flexunitResultFailJSON = readFileSync(FIXTURE +
                                            'flexunit_result_fail.json',
                                            'utf-8');
  var flexunitResultSuccessXML = readFileSync(FIXTURE +
                                               'flexunit_result_success.xml',
                                               'utf-8');
  var flexunitResultFailXML = readFileSync(FIXTURE +
                                            'flexunit_result_fail.xml',
                                            'utf-8');
  var flexunitResultSuccessOBJ = JSON.parse(flexunitResultSuccessJSON);
  var flexunitResultFailOBJ = JSON.parse(flexunitResultFailJSON);

  describe('policyFile', function(){
    var server;
    var client;

    before(function(){
      var rep = new PassThrough();
      server = fuserver(rep);
      server.listen(PORT, HOST);
      client = net.connect({port: PORT, host: HOST});
      client.setEncoding('ascii');
    });

    after(function(){
      server.close();
      client.end();
    });

    it('should return valid policy file', function(done){
      client.on('data', function(data){
        expect(data).to.equal(vars.POLICY_FILE_CONTENT);
        done();
      });
      client.write(vars.POLICY_FILE_REQUEST_TOKEN);
    });
  });


  describe('sendRecieveTokens', function(){
    var server;
    var client;

    beforeEach(function(){
      var rep = new PassThrough();
      server = fuserver(rep);
      server.listen(PORT, HOST);
      client = net.connect({port: PORT, host: HOST});
    });

    afterEach(function(){
      client.end();
      if (server) { server.close(); }
    });


    // startOfTestRunAck should be sent back in 1 sec
    it('should return startOfTestRunAck', function(done){
      this.timeout(1100);
      client.once('data', function(data){
        expect(data).to.deep.equal(vars.START_OF_TEST_RUN_ACK_TOKEN);
        done();
      });
    });

    it('should return endOfTestRunAck', function(done){
      client.once('data', function(data){
        expect(data).to.deep.equal(vars.END_OF_TEST_RUN_ACK_TOKEN);
        // server close automatically after sending ACK_END_OF_TEST_RUN
        server = null;
        done();
      });
      client.write(vars.END_OF_TEST_RUN_TOKEN);
    });
  });


  describe('checkReporterFunctionarity', function(){
    var server;
    var client;
    var rep;

    beforeEach(function(){
      rep = new PassThrough();
      server = fuserver(rep);
      server.listen(PORT, HOST);
      client = net.connect({port: PORT, host: HOST});
      client.setEncoding('ascii');
    });

    afterEach(function(){
      client.end();
      if (server) { server.close(); }
    });

    it('should parse successfull result', function(done){
      rep.on('data', function(chunk){
        expect(JSON.parse(chunk.toString())).to.deep.equal(
          flexunitResultSuccessOBJ
        );
        done();
      });
      client.write(flexunitResultSuccessXML);
    });

    it('should parse failed result', function(done){
      rep.on('data', function(chunk){
        expect(JSON.parse(chunk.toString())).to.deep.equal(
          flexunitResultFailOBJ
        );
        done();
      });
      client.write(flexunitResultFailXML);
    });

  });

  describe('resultAtOnce', function(){
    it('should parse nicely when all tokens are sent at once', function(done){
      var rep = new PassThrough();
      var server = fuserver(rep);
      server.listen(PORT, HOST);

      server.on('close', function(){
        done();
      });

      var client = net.connect({port: PORT, host: HOST});
      client.setEncoding('ascii');
      client.write(flexunitResultSuccessXML + vars.END_OF_TEST_RUN_TOKEN);
    })
  });
};
