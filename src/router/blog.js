const { getList,getDetail,updateDetail,delteBlog} = require('../controller/blog')
const {SuccessModel,ErrorModel} = require('../model/resModel')

const handleBlogRouter = (req,res)=>{
    const method = req.method
    const blogId = req.query.id
    // 获取博客列表
    if(method==='GET'&&req.path==='/api/blog/list'){
        return new SuccessModel(getList(req.query.author||'',req.query.keyword||''))
    }
    // 获取博客详情
    if(method==='GET'&&req.path==='/api/blog/detail'){
        return new SuccessModel(getDetail(blogId||''))
    }
    // 新建一篇博客
    if(method==='POST'&&req.path==='/api/blog/new'){
        return new SuccessModel(newBlog(req.body))
    }
    // 更新一篇博客
    if(method==='POST'&&req.path==='/api/blog/update'){
        const result = updateDetail(blogId,req.body)
        if(result){
            return new SuccessModel(result,'更新成功')
        }else{
            return new ErrorModel('更新博客失败')
        }
    }
    // 删除一篇博客
    if(method==='POST'&&req.path==='/api/blog/del'){
        const result = delteBlog(blogId)
        if(result){
            return new SuccessModel(result,'删除成功')
        }else{
            return new ErrorModel('删除博客失败')
        }
    }
}

module.exports=handleBlogRouter