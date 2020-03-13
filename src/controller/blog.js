const {exec} = require('../db/mysql')

const getList = (author, keyword) => {
    // where 1=1起到占位作用
    let sql = `select * from blogs where 1=1 `
    if(author){
        sql+=`and author='${author}'`
    }
    if(keyword){
        sql+=`and title like '%${keyword}%'`
    }
    sql+='order by createtime desc';
    return exec(sql)
}
const getDetail = (id) => {
    let sql = `select * from blogs where id='${id}'`
    return exec(sql).then(rows=>rows[0])
}
const newBlog = (data = {}) => {
    const {title,content,author} = data
    const createtime = Date.now()
    const sql = `insert into blogs (title,content,createtime,author) values ('${title}','${content}',${createtime},'${author}')`
    return exec(sql).then(insertData=>{
        return {
            id:insertData.insertId
        }
    })
}
const updateDetail = (id, blogData = {}) => {
    const {title,content} = blogData
    const sql = `update blogs set title='${title}',content='${content}' where id=${id}`

    return exec(sql).then(updateData=>{
        if(updateData.affectedRows>0){
            return true
        }
        return false
    })
}
const delteBlog = (id,author) => {
    const sql = `delete from blogs where id=${id} and author='${author}'`
    return exec(sql).then(deleteData=>{
        if(deleteData.affectedRows>0){
            return true
        }
        return false
    })
}
module.exports = {
    getList,
    getDetail,
    newBlog, updateDetail,delteBlog
}