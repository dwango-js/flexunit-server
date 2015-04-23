var e = exports;

e.POLICY_FILE_REQUEST = 'policy-file-request';
e.START_OF_TEST_RUN_ACK = 'startOfTestRunAck';
e.END_OF_TEST_RUN = 'endOfTestRun';
e.END_OF_TEST_RUN_ACK = 'endOfTestRunAck';

e.POLICY_FILE_REQUEST_TOKEN = new Buffer('<' + e.POLICY_FILE_REQUEST + '/>\x00');
e.START_OF_TEST_RUN_ACK_TOKEN = new Buffer('<' + e.START_OF_TEST_RUN_ACK + '/>\x00');
e.END_OF_TEST_RUN_TOKEN = new Buffer('<' + e.END_OF_TEST_RUN + '/>\x00');
e.END_OF_TEST_RUN_ACK_TOKEN = new Buffer('<' + e.END_OF_TEST_RUN_ACK + '/>\x00');

// Policy file that accept all connections
// http://gimite.net/pukiwiki/index.php?Flash%A4%CE%A5%BD%A5%B1%A5%C3%A5%C8%A5%DD%A5%EA%A5%B7%A1%BC%A5%D5%A5%A1%A5%A4%A5%EB
// http://www.adobe.com/jp/devnet/flashplayer/articles/socket_policy_files.html
// http://www.adobe.com/jp/devnet/flashplayer/articles/fplayer9_security.html
// http://help.adobe.com/ja_JP/FlashPlatform/reference/actionscript/3/flash/net/XMLSocket.html
e.POLICY_FILE_CONTENT = [
  '<?xml version="1.0"?>',
  '<!DOCTYPE cross-domain-policy SYSTEM "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd">',
  '<cross-domain-policy>',
  '<site-control permitted-cross-domain-policies="master-only"/>',
  '<allow-access-from domain="*" to-ports="*"/>',
  '</cross-domain-policy>'
].join("");
