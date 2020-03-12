const getList = (author, keyword) => {
    // 先返回假数据，（格式是正确的）
    return [
        {
            id: 1,
            title: '标题A',
            content: '内容A',
            createTime: 1583995742513,
            author: 'David'
        },
        {
            id: 2,
            title: '标题B',
            content: '内容B',
            createTime: 1583995804065,
            author: 'Lisa'
        },
    ]
}
const getDetail = (id) => {
    return {
        id: 1,
        title: '标题A',
        content: '内容A',
        createTime: 1583995742513,
        author: 'David'
    }
}
const newBlog = (data = {}) => {
    return {
        id: 3
    }
}
const updateDetail = (id, blogData = {}) => {
    return true
}
const delteBlog = (id) => {
    return true
}
module.exports = {
    getList,
    getDetail,
    newBlog, updateDetail,delteBlog
}