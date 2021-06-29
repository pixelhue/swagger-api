const fs = require('fs') //文件读写库
const request = require("request"); //request请求库
const path = require('path'); //系统路径模块

// 请求数据
function requestData(url, cb) {
  request({
    url: url,
    method: "get",
    json: true,
    headers: {
      "content-type": "application/json"
    }
  }, function (error, response, body) {
    if(error) {
      console.log(url);
    }else  if (!error && response.statusCode == 200) {
      cb(body)
    }
  })
}

// 写文件
function writerFile(url = '', data) {
  //把data对象转换为json格式字符串
  var content = typeof data === "string" ? data : JSON.stringify(data);

  //指定创建目录及文件名称，__dirname为执行当前js文件的目录
  var file = path.join(__dirname, url);

  //写入文件
  fs.writeFile(file, content, function(err) {
      if (err) {
        return console.log("文件写入错误err",err);
      }
      console.log('文件创建成功，地址：' + file);
  });
}

function apiCheck(col, fileName) {
  try {
    const cacheMap = {};
    let str = "export default {";
    // 遍历 接口
    Object.keys(col.paths).map(key => {
      let newKey =  key.replace(/-\w|\/\w/g, function(x) {
        return x.slice(1).toUpperCase();
      }).replace(/\/\{\w/g, function(x) {
        return x.slice(2).toUpperCase();
      }).replace(/\}/g,"");

      // 遍历所有的 type
      Object.keys(col.paths[key]).forEach(dataType => {
        if(cacheMap[newKey]) {
          newKey += dataType.slice(0).toUpperCase()
        }
        let value = "";
        if(!/\{id\}/.test(key)) {
          if(dataType == 'get' ) {
            str += `/*${col.paths[key][dataType].summary}*/
            ${newKey}: params => axios.${dataType}("bdp_api${key}", {params}),`
          }else {
            str += ` /*${col.paths[key][dataType].summary}*/
            ${newKey}: params => axios.${dataType}("bdp_api${key}", params),`
          }
        }else {
          str += `/*${col.paths[key][dataType].summary}*/
          ${newKey}: id => axios.${dataType}(\`bdp_api${ key.replace('{id}', '${id}') }\`),`
        }
        cacheMap[newKey] = value;
      })
    });
    str += "};"
    writerFile(`data/api-js/${fileName}.js`, str);
  } catch (e){
    console.log("error", fileName, e);
  }
}

function random(min,max){
  let range = max - min
  let rand = Math.random()
  let num = min + Math.round(rand * range)
  return num;
}

// sleep函数
function sleep(time) {
  return new Promise(function (resolve, reject) {
      setTimeout(function () {
          resolve()
      }, time)
  })
};

function swaggerJs(url, resources = "/swagger-resources") {
  // url = bdp_api;
  requestData(url + resources, async function(data) {
    for (let index = 0; index < data.length; index++) {
      const el = data[index];
      await sleep(random(100, 200));
      requestData(url + encodeURI(el.url), function(col) {
        apiCheck(col, el.name.replace(/\s+/g, ""))
      })
    }
  })
}

module.exports = swaggerJs;
