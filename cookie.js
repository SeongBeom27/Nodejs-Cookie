var http = require('http')
var cookie = require('cookie')
http
  .createServer(function (request, response) {
    console.log(request.headers.cookie)
    if (request.headers.cookie !== undefined) {
      var cookies = cookie.parse(request.headers.cookie)
      console.log(cookies)
    }
    // writeHead 두번째 인자에 쿠키 객체를 넣어줘야한다.
    response.writeHead(200, {
      'Set-Cookie': ['yummy_cookie=choco', 'tasty_cookie=strawberry'],
    })
    response.end('Cookie!!')
  })
  .listen(3001)
