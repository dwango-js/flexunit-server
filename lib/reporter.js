var debug = require('debug')('flexunit:reporter');
var xml2js = require('xml2js');

var inherits = require('util').inherits;
var stream = require('stream');

inherits(JunitReporter, stream.Transform);
function JunitReporter(options){
  stream.Transform.call(this, options);
  // TODO: pass name arg
  this.testName = 'FlexunitJunitReporter';
  this.rawResult = [];
  this.numAllTest = 0;
  this.numFailure = 0;
  this.numError = 0;
}

JunitReporter.prototype._transform = function(chunk, encoding, done){
  var data = JSON.parse(chunk);
  var self = this;
  debug(data);

  data.testcase.forEach(function(e){
    self.rawResult.push(e);
    self.numAllTest++;

    if (e.failure) {
      self.numFailure++;
    }

    if (e.error) {
      self.numError++;
    }
  });

  done();
};

JunitReporter.prototype._flush = function(done){
  // called for example when this.end() is called: no more data wont be written
  var resultXML = (new xml2js.Builder()).buildObject({
    testsuite: {
      $: {
        name: this.testName,
        tests: this.numAllTest.toString(),
        errors: this.numError.toString(),
        failures: this.numFailure.toString(),
        time: '0.000' // `time' is always unavailable from flexunit.
        // measure?
      },
      testcase: this.rawResult
    }
  });

  debug(resultXML);
  this.push(resultXML);

  done();
};

exports.Junit = JunitReporter;
exports.Raw = stream.PassThrough;
