var http = require('http')
var fs = require('fs')
var url = require('url')
var qs = require('querystring')
var template = require('./lib/template.js')
var path = require('path')
var sanitizeHtml = require('sanitize-html')
var cookie = require('cookie')

function authIsOwner(request, response) {
    var isOwner = false
    var cookies = {}
    if (request.headers.cookie) {
        cookies = cookie.parse(request.headers.cookie)
    }
    if (
        cookies.email === 'egoing777@gmail.com' &&
        cookies.password === '111111'
    ) {
        isOwner = true
    }
    return isOwner
}

function authStatusUI(request, response) {
    var authStatusUI = `<a href="/login">login</a>`
    if (authIsOwner(request, response)) {
        authStatusUI = `<a href="/logout_process">logout</a>`
    }
    return authStatusUI
}
var app = http.createServer(function(request, response) {
    var _url = request.url
    var queryData = url.parse(_url, true).query
    var pathname = url.parse(_url, true).pathname
    request.headers.cookie
    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', function(error, filelist) {
                var title = 'Welcome'
                var description = 'Hello, Node.js'
                var list = template.list(filelist)
                var html = template.HTML(
                    title,
                    list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`,
                    authStatusUI(request, response)
                )
                response.writeHead(200)
                response.end(html)
            })
        } else {
            fs.readdir('./data', function(error, filelist) {
                var filteredId = path.parse(queryData.id).base
                fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
                    var title = queryData.id
                    var sanitizedTitle = sanitizeHtml(title)
                    var sanitizedDescription = sanitizeHtml(description, {
                        allowedTags: ['h1'],
                    })
                    var list = template.list(filelist)
                    var html = template.HTML(
                        sanitizedTitle,
                        list,
                        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                        ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`,
                        authStatusUI(request, response)
                    )
                    response.writeHead(200)
                    response.end(html)
                })
            })
        }
    } else if (pathname === '/create') {
        fs.readdir('./data', function(error, filelist) {
            var title = 'WEB - create'
            var list = template.list(filelist)
            var html = template.HTML(
                title,
                list,
                `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,
                '',
                authStatusUI(request, response)
            )
            response.writeHead(200)
            response.end(html)
        })
    } else if (pathname === '/create_process') {
        if (authIsOwner(request, response) === false) {
            response.end(`Login Required!!`)
            return false
        }
        var body = ''
        request.on('data', function(data) {
            body = body + data
        })
        request.on('end', function() {
            var post = qs.parse(body)
            var title = post.title
            var description = post.description
            fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                response.writeHead(302, { Location: `/?id=${title}` })
                response.end()
            })
        })
    } else if (pathname === '/update') {
        fs.readdir('./data', function(error, filelist) {
            var filteredId = path.parse(queryData.id).base
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
                var title = queryData.id
                var list = template.list(filelist)
                var html = template.HTML(
                    title,
                    list,
                    `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`,
                    authStatusUI(request, response)
                )
                response.writeHead(200)
                response.end(html)
            })
        })
    } else if (pathname === '/update_process') {
        if (authIsOwner(request, response) === false) {
            response.end(`Login Required!!`)
            return false
        }
        var body = ''
        request.on('data', function(data) {
            body = body + data
        })
        request.on('end', function() {
            var post = qs.parse(body)
            var id = post.id
            var title = post.title
            var description = post.description
            fs.rename(`data/${id}`, `data/${title}`, function(error) {
                fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                    response.writeHead(302, { Location: `/?id=${title}` })
                    response.end()
                })
            })
        })
    } else if (pathname === '/delete_process') {
        if (authIsOwner(request, response) === false) {
            response.end(`Login Required!!`)
            return false
        }
        var body = ''
        request.on('data', function(data) {
            body = body + data
        })
        request.on('end', function() {
            var post = qs.parse(body)
            var id = post.id
            var filteredId = path.parse(id).base
            fs.unlink(`data/${filteredId}`, function(error) {
                response.writeHead(302, { Location: `/` })
                response.end()
            })
        })
    } else if (pathname == '/login') {
        fs.readdir('./data', function(error, filelist) {
            var title = 'Login'
            var list = template.list(filelist)
            var html = template.HTML(
                title,
                list,
                `
                  <form action="login_process" method="post">
                    <p><input type="text" name="email" placeholder="email"></p>
                    <p><input type="password" name="password" placeholder="password"</p>
                    <p><input type="submit"></p>
                  </form>
                `,
                `<a href="/create">create</a>`,
                authStatusUI(request, response)
            )
            response.writeHead(200)
            response.end(html)
        })
    } else if (pathname == `/login_process`) {
        var body = ''
        request.on('data', function(data) {
            body = body + data
        })
        request.on('end', function() {
            // post에 담겨있는 이메일, 패스워드만 있으면 된다.
            var post = qs.parse(body)
            if (post.email === 'egoing777@gmail.com' && post.password === '111111') {
                response.writeHead(302, {
                    'Set-Cookie': [
                        `email=${post.email}`,
                        `password=${post.password}`,
                        `nickname=egoing`,
                    ],
                    Location: `/`,
                })
                response.end()
            } else {
                response.end(`Who?`)
            }
        })
    } else if (pathname == `/logout_process`) {
        var body = ''
        request.on('data', function(data) {
            body = body + data
        })
        request.on('end', function() {
            // post에 담겨있는 이메일, 패스워드만 있으면 된다.
            var post = qs.parse(body)
            response.writeHead(302, {
                'Set-Cookie': [
                    `email=;    Max-Age=0`,
                    `password=  Max-Age=0`,
                    `nickname=  Max-Age=0`,
                ],
                Location: `/`,
            })
            response.end()
        })
    } else {
        response.writeHead(404)
        response.end('Not found')
    }
})
app.listen(3002)

/**
 * 이후 해볼 것들!!
 *
 * 1. 현재까지 cookie에 사용자의 정보를 저장하고 있었다.
 *
 * 후속 수업에서 사용하는 세션을 사용하면 훨씬 안전하다.
 *
 * 각 사용자들의 식별자만 저장하고 자세한 정보는 DB 등에 저장을 한다.
 *
 * 2. 사용자들에 따라 개인화 해보기
 *
 *     (1) 언어, background color 등
 *     (2) 사용자에 따라 언어, background color 등을 저장해놓는 것
 *     (3) localStorage, Indexed DB 등 쿠키 이상의 많은 정보를 저장할 수 있다.
 *
 *     (4) PBKDF2, brcypt
 *          -> 암호화 자동화
 *          -> hash, salt, key stretching 을 중첩적으로 사용
 */