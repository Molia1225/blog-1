const { getList,getDetail,updateDetail,delteBlog,newBlog} = require('../controller/blog')
const {SuccessModel,ErrorModel} = require('../model/resModel')

const handleBlogRouter = (req,res)=>{
    const method = req.method
    const blogId = req.query.id
    // 获取博客列表
    if(method==='GET'&&req.path==='/api/blog/list'){
        return getList(req.query.author||'',req.query.keyword||'').then(listData=>{
            return new SuccessModel(listData)
        })
    }
    // 获取博客详情
    if(method==='GET'&&req.path==='/api/blog/detail'){
        return getDetail(blogId||'').then(rows=>new SuccessModel(rows))
        // return new SuccessModel(getDetail(blogId||''))
    }
    // 新建一篇博客
    if(method==='POST'&&req.path==='/api/blog/new'){
        req.body.author = 'zhangsan'
        return newBlog(req.body).then(data=>new SuccessModel(data))
        // return new SuccessModel(newBlog(req.body))
    }
    // 更新一篇博客
    if(method==='POST'&&req.path==='/api/blog/update'){
        return updateDetail(blogId,req.body).then(result=>{
            if(result){
                return new SuccessModel(result,'更新成功')
            }else{
                return new ErrorModel('更新博客失败')
            }
        })
    }
    // 删除一篇博客
    if(method==='POST'&&req.path==='/api/blog/del'){
        const author='zhangsan'
        return delteBlog(blogId,author).then(result=>{
            if(result){
                return new SuccessModel(result,'删除成功')
            }else{
                return new ErrorModel('删除博客失败')
            }
        })
    }
}

module.exports=handleBlogRouter