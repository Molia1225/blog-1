const {login} = require('../controller/user')
const {SuccessModel,ErrorModel} = require('../model/resModel')
const {get,set} = require('../db/redis')

const handleUserRouter = (req,res)=>{
    const method = req.method
    
    // 登录
    if(method=='POST'&&req.path=='/api/user/login'){
        const {username,password} = req.body
        // const {username,password} = req.query
        return login(username,password).then(data=>{
            if(data.username){
                req.session.username = data.username
                req.session.realname = data.realname
                set(req.sessionId,req.session)
                return new SuccessModel(data,'登录成功')
            }
            return new ErrorModel('登录失败')
        })
    }
    // 登录验证测试
    /* if(method=='GET'&&req.path=='/api/user/login-test'){
        if(req.session.username){
            return Promise.resolve(new SuccessModel(req.session))
        }
        return Promise.resolve(new ErrorModel('尚未登录'))
    } */
}
module.exports=handleUserRouter