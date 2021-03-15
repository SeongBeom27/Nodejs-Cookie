var http = require('http');
var cookie = require('cookie');

http.createServer(function(request, response) {
    var cookies = {};
    // parse는 undefined를 처리 못한다.
    if (request.headers.cookie != undefined) {
        cookies = cookie.parse(request.headers.cookie);
    }
    console.log(cookies.yummy_cookie);
    // Max-Age는 쿠키가 얼마동안 살 것인가.
    response.writeHead(200, {
        'Set-Cookie': ['yummy_cookie=choco',
            'tasty_cookie=strawberry',
            `Permanent=cookies; Max-Age=${60*60*24*30}`
        ]
    });
    response.end('Cookie!!');
}).listen(3000);