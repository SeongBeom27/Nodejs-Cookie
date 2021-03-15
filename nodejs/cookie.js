var http = require('http');
http.createServer(function(request, response) {
    // writeHead 두번째 인자에 쿠키를 객체 형식으로 넣어준다.
    // response.writeHead(200, {
    //     'Set-Cookie': ['yummy_cookie=choco', 'tasty_cookie=strawberry']
    // });
    response.end('Cookie!!');
}).listen(3000);