const fs = require('fs')
const path = require('path')

function writeLog (writeStream,log) { 
  writeStream.write(log+'\n')
 }
function createWrtStream (fileName) {  
  const fullFileName = path.join(__dirname,'../','../','logs',fileName)
  const writeStream = fs.createWriteStream(fullFileName,{
    flags:'a'
  })
  return writeStream
}

const accessWriteStream = createWrtStream('access.log')
function access(log){
  writeLog(accessWriteStream,log)
}

module.exports={
  access
}