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
    // cookie 옵션으로 Secure, HttpOnly, path, domain 학습
    /**
     * Secure, HttpOnly : 보안을 위한 옵션
     * Path : 원하는 경로 (디렉토리) 에 대해서만 Cookie가 활성되어 웹 브라우저가 서버에 전송할 수 있다.
     * Domain : 추가적으로 공부 필요
     */
    response.writeHead(200, {
      'Set-Cookie': [
        'yummy_cookie=choco',
        'tasty_cookie=strawberry',
        `Permanent=cookies; Max-age=${60 * 60}`,
        'Secure=Secure; Secure',
        'HttpOnly=HttpOnly; HttpOnly',
        'Path=Path; Path=/cookie',
        'Domain=Domain; Domain=o2.org',
      ],
    })
    response.end('Cookie!!')
  })
  .listen(3001)
