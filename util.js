const fs = require('fs');
const path = require('path');

function judgeToken() {
  let data = getToken();

  console.log(data);
  if(!data) {
    return true;
  }

  data = JSON.parse(data);

  if(data.time > Date.now()) {
    // token未失效
    return false;
  } else {
    // token失效
    return true;
  }
}

function getToken() {
  const file = path.join(__dirname, './secret.json');

  return readFile(file);
}

// 写
function writeFile(file, data) {
  if(!data) {
    return;
  }

  fs.writeFile(file, data, function(err) {
    if(err) throw err;

    console.log('The file has been write');
  });
}
// 读
function readFile(file) {
  if(!file) {
    return;
  }

  return fs.readFileSync(file, 'utf8', function(err, data){
    if(err) throw err;
  });
}

module.exports = {
  writeFile,
  readFile,
  judgeToken,
  getToken,
}