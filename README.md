Pass a string representing a resource (could be to a file as utf8 or http(s)), and this will get it for you--useful for when you want to easily change environment variables between a local filesystem and a remote resource.

```javascript
const getResource = require('resource-string')
var myResource = getResource(process.env['variable'])
```