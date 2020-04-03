const mysql = require('mysql')
const {MYSQL_CONF} = require('../conf/db')

// 创建连接
const conn = mysql.createConnection(MYSQL_CONF)
// 开始连接
conn.connect()

// 执行sql语句
function exec(sql){
  return new Promise((resolve,reject)=>{
    conn.query(sql,(err,result)=>{
      if(err){
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

module.exports={
  exec,
  escape:mysql.escape//防止sql注入
}