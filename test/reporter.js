var expect = require('chai').expect;
var debug = require('debug')('test');
var readFileSync = require('fs').readFileSync;

var reporter = require('../lib').reporter;

var vars = require('../lib/vars.js');

var FIXTURE = __dirname + '/fixtures/';

module.exports = function(){
  describe('junitReporter', function(){
    var rep;
    beforeEach(function(){
      rep = new reporter.Junit();
    });

    var flexunitResultSuccessJSON = readFileSync(FIXTURE +
                                                 'flexunit_result_success.json',
                                                 'utf-8');
    var flexunitResultFailJSON = readFileSync(FIXTURE +
                                              'flexunit_result_fail.json',
                                              'utf-8');
    var flexunitResultSuccessOBJ = JSON.parse(flexunitResultSuccessJSON);
    var flexunitResultFailOBJ = JSON.parse(flexunitResultFailJSON);

    describe('eatResult', function(){
      it('should eat successful result', function(){
        rep.write(flexunitResultSuccessJSON);
        expect(rep.rawResult).to.deep.equal([
          flexunitResultSuccessOBJ.testcase[0]
        ]);
        expect(rep.numAllTest).to.equal(1);
        expect(rep.numFailure).to.equal(0);
        expect(rep.numError).to.equal(0);
      });

      it('should eat failed result', function(){
        rep.write(flexunitResultFailJSON);
        expect(rep.rawResult).to.deep.equal([
          flexunitResultFailOBJ.testcase[0]
        ]);
        expect(rep.numAllTest).to.equal(1);
        expect(rep.numFailure).to.equal(1);
        expect(rep.numError).to.equal(0);
      });

      it('should eat multiple results', function(){
        rep.write(flexunitResultSuccessJSON);
        rep.write(flexunitResultFailJSON);
        expect(rep.rawResult).to.deep.equal([
          flexunitResultSuccessOBJ.testcase[0],
          flexunitResultFailOBJ.testcase[0]
        ]);
        expect(rep.numAllTest).to.equal(2);
        expect(rep.numFailure).to.equal(1);
        expect(rep.numError).to.equal(0);
      });

    });

    describe('emitFinishEvent', function(){
      it('should emit finish event on end', function(done){
        rep.on('finish', function(){
          done();
        });
        rep.end();
      });
    });

    describe('outputToFile', function(){
      it('should output result xml to specified file', function(done){
        rep.on('data', function(data){
          expect(data.toString() + '\n').to.equal(readFileSync(FIXTURE + 'junitreporter_output.xml', 'utf-8'));
          done();
        });
        rep.end(flexunitResultSuccessJSON);
      });
    });
  });

  describe('rawReporter', function(){
    it('should emit data as it recieved', function(done){
      var str = 'abc';
      var rep = new reporter.Raw();
      rep.on('data', function(data){
        expect(data.toString()).to.equal(str);
        done();
      });
      rep.write(str);
    });
  });

};
