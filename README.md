flexunit-server
===============

FlexUnit Node.js server.

This module accepts connections from FlexUnit CIListener and generates results
with given reporter.



Usage Example
-------------

```js
var fuserver = require("flexunit-server");

var reporter = new fuserver.reporter["Junit"];
var server = fuserver.createServer(reporter);
server.listen(8080);
```
