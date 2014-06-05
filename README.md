# connect-mockery [![Build Status](https://secure.travis-ci.org/ivantage/connect-mockery.png?branch=master)](http://travis-ci.org/ivantage/connect-mockery)

Connect middleware for simple resource mocking in single page apps

## Getting Started
Install the module with: `npm install connect-mockery`

## Documentation
Connect-Mockery lets you put some variance in your mock data.

This module exports a single function which takes a config object and returns a
function to `use`d as connect/express middleware.

The middleware looks at incoming requests, sees if they match a folder in your
mocks `mockBase` and if so the server will respond with one of the files it sees
there. Which file? Connect Mockery will cycle through them so subsequent
requests can get different responses.

Suppose I have this folder structure in my app root:

```
/mock
  /users
    user-001.json
    user-002.json
    user-003.json
```

The first request to `/mock/users` will get `user-001.json`, the next request
gets `user-002.json` and so on. Connect Mockery will reset the cycling process
on page reloads (in particular on requests to '/').

Use the `appBase` option to set you app base directory (defaults to
`process.cwd() + '/app'`)

Use the `mockBase` option to set your mocks base directory (defaults to
`/mock'`).

Use the `cleanCacheOnRefresh` option to enable/disable cycle resetting (defaults
to `true`).

## Examples

```
var mockery = require('connect-mockery');

var opts = {
    appBase: __dirname + '/app',
    mockBase: '/mock',
    cleanCacheOnRefresh: true
  };

var app = connect()
  .use(mockery(opts))
  // ...
  .use(function(req, res) {
    res.end('hello world\n');
  });
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using [Grunt](http://gruntjs.com/).

## Release History
- v0.1.0 Initial release

## License
Copyright (c) 2014 iVantage Health Analytics, Inc.
Licensed under the MIT license.
