const queryString = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const {get,set} = require('./src/db/redis')
const {access} = require('./src/utils/log')

const getCookieExpires = ()=>{
    const d=new Date()
    d.setTime(d.getTime()+(24*3600*1000))
    console.log('d.toGMTString',d.toGMTString())
    return d.toGMTString()
}
// 处理post数据
const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
}

const serverHandle = (req, res) => {
    // 记录access log
    access(`${req.method}--${req.url}--${req.headers['user-agent']}--${Date.now()}`)
    // 设置返回格式
    res.setHeader('Content-type', 'application/json')
    // 获取path
    const url = req.url
    req.path = url.split('?')[0]
    // 解析query
    req.query = queryString.parse(url.split('?')[1])

    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie||'';
    cookieStr.split(';').forEach(item => {
        if(!item){
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const value = arr[1].trim()
        req.cookie[key]=value
    });
    
    let needSetCookie = false
    let userId = req.cookie.userId
    if(!userId){
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()*10}`
        // 初始化redis中的session值
        set(userId,{})
    }
    // 获取session
    req.sessionId = userId
    get(req.sessionId).then(sessionData=>{
        if(sessionData==null){
            // 初始化redis中的session值
            set(req.sessionId,{})
            // 设置session
            req.session={}
        }else{
            req.session = sessionData
        }
        console.log(req.session,'session值')
        return getPostData(req)
    })
    .then(postData => {
        req.body = postData
        // 处理blog路由
        const blogResult = handleBlogRouter(req, res);
        if(blogResult){
            if(needSetCookie){
                res.setHeader('Set-Cookie',`userId=${req.sessionId};path=/;httpOnly;expires=${getCookieExpires()}`)
            }
            blogResult.then(blogData=>{
                res.end(JSON.stringify(blogData))
            })
            return
        }
        // const blogData = handleBlogRouter(req, res)
        /* if (blogData) {
            res.end(JSON.stringify(blogData))
            return
        } */

        // 处理user路由
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            if(needSetCookie){
                res.setHeader('Set-Cookie',`userId=${req.sessionId};path=/;httpOnly;expires=${getCookieExpires()}`)
            }
            userResult.then(userData=>{
                res.end(JSON.stringify(userData))
            })
            return
        }
        // 未命中路由返回404
        res.writeHead(404, { 'Content-type': 'text/plain' })
        res.write('404 not found\n')
        res.end()
    })
}

module.exports = serverHandle